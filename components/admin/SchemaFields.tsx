"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, type ReactNode } from "react";
import {
  imageUrl,
  labels,
  adminGuidance,
  text,
  type Field,
  type ImageValue,
  type Source,
  type LocalCopy,
} from "@/lib/local-studio";
import s from "./local-studio.module.css";
import HelpTip from "./HelpTip";
import { optimizeCover } from "@/lib/admin/image-client";
import { articleCategoryLabel, isLegacyArticleCategory } from "@/lib/editorial/categories";
export type MediaContext = {
  source: Source;
  title?: string;
  pending: LocalCopy["pendingMedia"];
  busy?: boolean;
  onBusy?: (busy: boolean) => void;
  setPending: (path: string, value?: { name: string; dataUrl: string }) => void;
};
export function ImageField({
  value,
  onChange,
  path,
  context,
  urlOnly = false,
  uploadOnly = false,
  alt = false,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  path: string;
  context: MediaContext;
  urlOnly?: boolean;
  uploadOnly?: boolean;
  alt?: boolean;
}) {
  const [library, setLibrary] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const img = (
    typeof value === "object" && value ? value : { _type: "image" }
  ) as ImageValue;
  const pending = context.pending[path];
  const src = pending?.dataUrl || imageUrl(value, context.source);
  return (
    <div className={s.imageField}>
      {src && <img src={src} alt={text(img.alt) || "선택한 이미지 미리보기"} />}
      <div className={s.actions}>
        {!uploadOnly && (
          <button
            type="button"
            className={s.secondary}
            onClick={() => setLibrary(!library)}
          >
            기존 이미지 선택
          </button>
        )}
        <label className={s.secondary}>
          {processing ? "사진 최적화 중…" : uploadOnly ? "업로드하기" : "내 컴퓨터에서 선택"}
          <input
            className={s.file}
            type="file"
            disabled={processing || context.busy}
            accept="image/jpeg,image/png,image/webp,image/gif"
            aria-label={`${labels[path] || "이미지"} 업로드하기`}
            onChange={async (e) => {
              const input = e.currentTarget;
              const file = input.files?.[0];
              if (!file) return;
              if (
                ![
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                  "image/gif",
                ].includes(file.type) ||
                file.size > (path === "mainImage" && file.type !== "image/gif" ? 30 : 8) * 1024 * 1024
              ) {
                setError(path === "mainImage" ? "사진은 30MB 이하, GIF는 8MB 이하 파일을 선택하세요." : "JPG·PNG·WebP·GIF, 8MB 이하 파일을 선택하세요.");
                input.value = "";
                return;
              }
              try {
                if (path === "mainImage") { setProcessing(true); context.onBusy?.(true); }
                const dataUrl = await new Promise<string>((resolve, reject) => {
                  const r = new FileReader();
                  r.onload = () => resolve(String(r.result));
                  r.onerror = r.onabort = () =>
                    reject(new Error("이미지 읽기에 실패했습니다."));
                  r.readAsDataURL(file);
                });
                const cover = path === "mainImage" ? await optimizeCover(dataUrl, file.name) : { name: file.name, dataUrl };
                context.setPending(path, { name: cover.name, dataUrl: cover.dataUrl });
                setError("");
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "이미지를 읽을 수 없습니다.",
                );
              } finally {
                if (path === "mainImage") { setProcessing(false); context.onBusy?.(false); }
                input.value = "";
              }
            }}
          />
        </label>
        {pending && (
          <button type="button" onClick={() => context.setPending(path)}>
            새 이미지 선택 취소
          </button>
        )}
      </div>
      {pending && (
        <p className={s.hint}>
          새 파일: {pending.name} · 저장 버튼을 누르면 이미지가 함께 저장됩니다.
          업로드 전까지 기존 이미지 참조를 유지합니다.
        </p>
      )}
      {error && (
        <p role="alert" className={s.error}>
          {error}
        </p>
      )}
      {!uploadOnly && library && (
        <div className={s.assetGrid}>
          {context.source.assets.length === 0 ? (
            <p>등록된 이미지가 없습니다.</p>
          ) : (
            context.source.assets.map((asset) => (
              <button
                type="button"
                key={asset._id}
                title={asset.originalFilename || asset._id}
                onClick={() => {
                  // A different asset must not inherit the previous image's crop/hotspot.
                  const { crop: _crop, hotspot: _hotspot, ...rest } = img;
                  void _crop;
                  void _hotspot;
                  onChange(
                    urlOnly
                      ? asset.url
                      : {
                          ...rest,
                          _type: "image",
                          asset: { _type: "reference", _ref: asset._id },
                        },
                  );
                  context.setPending(path);
                  setLibrary(false);
                }}
              >
                <img
                  src={asset.url + "?w=160&h=100&fit=crop"}
                  alt={asset.originalFilename || "저장된 이미지"}
                />
                <small>{asset.originalFilename || "이미지"}</small>
              </button>
            ))
          )}
        </div>
      )}
      {!urlOnly && alt && (
        <label className={s.subfield}>
          이미지 설명 · alt
          <input
            value={text(img.alt)}
            onChange={(e) => onChange({ ...img, alt: e.target.value })}
          />
        </label>
      )}
      {!urlOnly && img.asset?._ref && (
        <details className={s.hint}>
          <summary>이미지 자르기·초점</summary>
          <p>
            기존 자르기·초점 값을 보존합니다. 0~1 비율로 조절할 수 있습니다.
          </p>
          {(["crop", "hotspot"] as const).map((group) => (
            <div className={s.miniGrid} key={group}>
              {(group === "crop"
                ? ["top", "bottom", "left", "right"]
                : ["x", "y", "width", "height"]
              ).map((key) => (
                <label key={key}>
                  {({top: "위쪽", bottom: "아래쪽", left: "왼쪽", right: "오른쪽", x: "가로 위치", y: "세로 위치", width: "너비", height: "높이"} as Record<string, string>)[key]}
                  <input
                    aria-label={`${path} ${group}.${key}`}
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={
                      img[group]?.[key] ??
                      (group === "crop"
                        ? 0
                        : key === "x" || key === "y"
                          ? 0.5
                          : 1)
                    }
                    onChange={(e) => {
                      if (e.target.value === "") return;
                      const defaults =
                        group === "crop"
                          ? {
                              _type: "sanity.imageCrop",
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 0,
                            }
                          : {
                              _type: "sanity.imageHotspot",
                              x: 0.5,
                              y: 0.5,
                              width: 1,
                              height: 1,
                            };
                      onChange({
                        ...img,
                        [group]: {
                          ...defaults,
                          ...img[group],
                          [key]: Math.max(
                            0,
                            Math.min(1, Number(e.target.value)),
                          ),
                        },
                      });
                    }}
                  />
                </label>
              ))}
            </div>
          ))}
        </details>
      )}
    </div>
  );
}
function Strings({
  value,
  onChange,
  label,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
  label: string;
}) {
  const items = Array.isArray(value) ? (value as string[]) : [];
  return (
    <div>
      {items.map((v, i) => (
        <div className={s.inline} key={i}>
          <input
            aria-label={`${label} ${i + 1}`}
            value={v}
            onChange={(e) =>
              onChange(items.map((x, j) => (j === i ? e.target.value : x)))
            }
          />
          <button
            type="button"
            className={s.iconButton}
            aria-label={`${label} ${i + 1} 삭제`}
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className={s.textButton}
        onClick={() => onChange([...items, ""])}
      >
        + {label} 추가
      </button>
    </div>
  );
}
function Keywords({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const items = Array.isArray(value) ? (value as string[]) : [];
  const [input, setInput] = useState("");
  function add() {
    const keyword = input.trim();
    if (keyword && !items.includes(keyword)) onChange([...items, keyword]);
    setInput("");
  }
  return (
    <div>
      <div className={s.keywordTags} aria-label="입력된 검색 키워드">
        {items.map((keyword, index) => (
          <span className={s.keywordTag} key={index}>
            {keyword}
            <button
              type="button"
              aria-label={`${keyword} 키워드 삭제`}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className={s.inline}>
        <input
          id="field-keywords"
          aria-describedby="help-keywords"
          placeholder="예: SAT 튜터링 — 입력 후 엔터"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={add}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          className={s.secondary}
          onMouseDown={(e) => e.preventDefault()}
          onClick={add}
        >
          추가
        </button>
      </div>
    </div>
  );
}
const help: Record<string, string> = {
  mainImage: "대표 이미지입니다. 사진은 자동으로 크기·용량을 줄입니다. JPG·PNG·WebP 30MB 이하, GIF 8MB 이하. 저장 또는 발행할 때 업로드됩니다.",
  slug: "글의 주소입니다. 제목 추천으로 기존 주소는 바뀌지 않습니다. 발행된 글의 주소를 직접 바꾸기 전에는 기존 링크를 확인하세요.",
  schemaOrgType: "검색엔진에 이 글이 어떤 종류의 콘텐츠인지 알려주는 정보입니다. 일반 저널 글은 블로그 글을 사용하세요. 화면에 보이는 내용과 맞춰야 합니다.",
  ogImage: "카카오·SNS에 글 링크를 공유할 때 표시할 썸네일입니다. 비워두면 대표 이미지를 사용합니다. 1200×630px 권장.",
  focusKeyphrase:
    "이 글의 핵심 검색어 한 개를 적으세요. 예: SAT 튜터링 · # 없이 입력하며, 엔터로 항목을 나누지 않습니다.",
  keywords:
    "초안작성하기를 누르면 AI가 글 내용에 맞는 검색 키워드 3~6개를 자동 추천합니다. 추천 항목은 직접 추가·삭제할 수 있습니다. 검색 순위를 높이는 필수 입력값은 아닙니다.",
  twitterTitle: "X(트위터)에 이 글의 링크를 공유할 때 미리보기 카드에 사용하는 제목입니다. 비워두면 검색 제목 또는 글 제목을 사용합니다. X에 자동으로 게시하는 기능은 아닙니다.",
  twitterDescription: "X(트위터) 링크 미리보기용 설명입니다. 비워두면 검색 설명 또는 글 요약을 사용합니다. 표시 방식은 X에서 결정합니다.",
  publishedAt:
    "브라우저 시간대 기준으로 표시할 날짜입니다. 예약 발행 기능이 아니며, 미래 날짜를 선택해도 발행 버튼을 누르면 즉시 공개됩니다.",
  canonical:
    "동일한 글의 원본이 다른 주소에 있을 때만 원본 글의 전체 URL을 입력하세요. 처음 작성하는 글은 비워두면 이 글 주소가 자동으로 사용됩니다. 이미지 주소를 넣는 칸이 아닙니다.",
  noindex:
    "켜면 검색엔진에 이 글을 검색 결과에서 제외하도록 요청합니다. 비공개 기능은 아니므로, 글 주소를 아는 사람은 볼 수 있습니다. 이미 검색된 글의 제외에는 시간이 걸릴 수 있습니다.",
};
export function SchemaField({
  field,
  value,
  onChange,
  path,
  context,
  body,
  labelOverride,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  path: string;
  context: MediaContext;
  body?: ReactNode;
  labelOverride?: string;
}) {
  const label = labelOverride || labels[field.name] || field.title || field.name;
  const id = `field-${path}`;
  let control: ReactNode;
  if (field.name === "writingGuide") return null;
  if (field.name === "body") control = body;
  else if (
    field.type === "image" ||
    (field.name === "mainImage" && field.type === "url")
  )
    control = (
      <ImageField
        value={value}
        onChange={onChange}
        path={path}
        context={context}
        urlOnly={field.type === "url"}
        uploadOnly={field.name === "mainImage"}
        alt={field.fields?.some((f) => f.name === "alt")}
      />
    );
  else if (field.type === "boolean")
    control = (
      <label className={s.toggle}>
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(e.target.checked)}
        />
        {field.name === "published"
          ? "프로그램 공지를 예정 수업 영역에 표시"
          : label}
      </label>
    );
  else if (field.type === "slug") {
    const slug = (value || {}) as Record<string, unknown>;
    control = (
      <div className={s.inline}>
        <input
          id={id}
          value={text(slug.current)}
          onChange={(e) =>
            onChange({ ...slug, _type: "slug", current: e.target.value })
          }
        />
        <button
          type="button"
          className={s.secondary}
          disabled={!context.title}
          onClick={() => {
            if (
              text(slug.current) &&
              !window.confirm(
                "현재 글 주소를 제목으로 다시 만들까요? 운영에 반영하면 기존 링크가 바뀔 수 있습니다.",
              )
            )
              return;
            onChange({
              ...slug,
              _type: "slug",
              current: (context.title || "")
                .normalize("NFKC")
                .toLowerCase()
                .replace(/[^\p{L}\p{N}]+/gu, "-")
                .replace(/^-|-$/g, "")
                .slice(0, field.options?.maxLength || 96),
            });
          }}
        >
          제목으로 생성
        </button>
      </div>
    );
  } else if (field.options?.list)
    control = (
      <select
        id={id}
        value={text(value)}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">선택하세요</option>
        {field.name === "category" && isLegacyArticleCategory(value) && (
          <option value={value}>{articleCategoryLabel(value)} (기존 분류)</option>
        )}
        {field.options.list.map((item) => {
          const v = typeof item === "string" ? item : item.value;
          return (
            <option key={v} value={v}>
              {({ BlogPosting: "블로그 글", Article: "기사", FAQPage: "질문과 답변", Course: "강좌", Service: "서비스" } as Record<string, string>)[v] || adminGuidance(typeof item === "string" ? item : item.title)}
            </option>
          );
        })}
      </select>
    );
  else if (field.name === "keywords")
    control = <Keywords value={value} onChange={onChange} />;
  else if (field.type === "array" && field.of?.[0]?.type === "string")
    control = <Strings value={value} onChange={onChange} label={label} />;
  else if (field.type === "array") {
    const items = Array.isArray(value)
      ? (value as Record<string, unknown>[])
      : [];
    const member = field.of?.[0];
    control = (
      <div>
        {items.map((item, i) => (
          <div className={s.arrayItem} key={text(item._key) || i}>
            <div className={s.arrayHead}>
              <strong>
                {label} {i + 1}
              </strong>
              <div className={s.actions}>
                <button
                  type="button"
                  disabled={i === 0}
                  aria-label={`${label} ${i + 1} 위로`}
                  onClick={() => {
                    const next = [...items];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === items.length - 1}
                  aria-label={`${label} ${i + 1} 아래로`}
                  onClick={() => {
                    const next = [...items];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    onChange(next);
                  }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, j) => j !== i))}
                >
                  삭제
                </button>
              </div>
            </div>
            {member?.fields?.map((f) => (
              <SchemaField
                key={f.name}
                field={f}
                path={`${path}.${text(item._key)}.${f.name}`}
                value={item[f.name]}
                context={context}
                onChange={(v) =>
                  onChange(
                    items.map((x, j) => (j === i ? { ...x, [f.name]: v } : x)),
                  )
                }
              />
            ))}
          </div>
        ))}
        <button
          type="button"
          className={s.secondary}
          onClick={() =>
            onChange([
              ...items,
              {
                _key: crypto.randomUUID(),
                _type: member?.name || member?.type || "object",
              },
            ])
          }
        >
          + {label} 추가
        </button>
      </div>
    );
  } else if (field.type === "text")
    control = (
      <textarea
        id={id}
        rows={field.rows || 4}
        value={text(value)}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  else if (field.type === "datetime") {
    const date = text(value);
    let local = "";
    if (date && !Number.isNaN(Date.parse(date))) {
      const d = new Date(date);
      local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
    control = (
      <>
        <input
          id={id}
          type="datetime-local"
          value={local}
          onChange={(e) =>
            onChange(
              e.target.value ? new Date(e.target.value).toISOString() : "",
            )
          }
        />

      </>
    );
  } else
    control = (
      <input
        id={id}
        type={field.type === "url" ? "url" : "text"}
        readOnly={field.hidden || field.readOnly}
        value={text(value)}
        placeholder={
          field.name === "canonical"
            ? "보통은 비워두세요 · 필요한 경우 https://…"
            : field.name === "focusKeyphrase"
              ? "예: SAT 튜터링"
              : undefined
        }
        onChange={(e) => onChange(e.target.value)}
      />
    );
  const content = (
    <div className={s.field} data-schema-field={field.name}>
      <div className={s.fieldLabel}>
        {(help[field.name] || field.description) ? <HelpTip id={`help-${path}`} text={adminGuidance(help[field.name] || field.description || "")}>
          <label htmlFor={id} tabIndex={0} aria-describedby={`help-${path}`}>
            {label}{field.required && <span className={s.required}> *</span>}
            {field.hidden && <small>기존 관리 화면에서 숨김</small>}
          </label>
        </HelpTip> : <label htmlFor={id}>{label}{field.required && <span className={s.required}> *</span>}</label>}
      </div>
      {control}

    </div>
  );
  return field.name === "noindex" ? <details className={s.advancedSettings} open={value === true || undefined}><summary>고급 설정 · 검색 노출{value === true ? " (검색 제외 중)" : ""}</summary>{content}</details> : content;
}
