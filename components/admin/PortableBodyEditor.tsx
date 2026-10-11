"use client";
import { useState } from "react";
import { prepareBody } from "@/lib/admin/prepare-body";
import {
  defineSchema,
  EditorProvider,
  PortableTextEditable,
  useEditor,
  useEditorSelector,
  type BlockRenderProps,
  type FieldDefinition,
  type PortableTextBlock,
  type RenderStyleFunction,
  type RenderDecoratorFunction,
} from "@portabletext/editor";
import { EventListenerPlugin } from "@portabletext/editor/plugins";
import * as selectors from "@portabletext/editor/selectors";
import { schemas, type DocumentType } from "@/lib/local-studio";
import { ImageField, SchemaField, type MediaContext } from "./SchemaFields";
import s from "./local-studio.module.css";
const decorators = [
  { name: "strong", title: "굵게" },
  { name: "em", title: "기울임" },
  { name: "underline", title: "밑줄" },
  { name: "strike-through", title: "취소선" },
  { name: "code", title: "코드" },
];
const renderStyle: RenderStyleFunction = ({ value, children }) =>
  value === "h1" ? (
    <h1>{children}</h1>
  ) : value === "h2" ? (
    <h2>{children}</h2>
  ) : value === "h3" ? (
    <h3>{children}</h3>
  ) : value === "h4" ? (
    <h4>{children}</h4>
  ) : value === "h5" ? (
    <h5>{children}</h5>
  ) : value === "h6" ? (
    <h6>{children}</h6>
  ) : value === "blockquote" ? (
    <blockquote>{children}</blockquote>
  ) : (
    <p>{children}</p>
  );
const renderDecorator: RenderDecoratorFunction = ({ value, children }) =>
  value === "strong" ? (
    <strong>{children}</strong>
  ) : value === "em" ? (
    <em>{children}</em>
  ) : value === "underline" ? (
    <u>{children}</u>
  ) : value === "strike-through" ? (
    <s>{children}</s>
  ) : value === "code" ? (
    <code>{children}</code>
  ) : (
    <>{children}</>
  );
function MarkButton({ name, title }: { name: string; title: string }) {
  const editor = useEditor();
  const active = useEditorSelector(editor, selectors.isActiveDecorator(name));
  return (
    <button
      type="button"
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        editor.send({ type: "decorator.toggle", decorator: name });
        editor.send({ type: "focus" });
      }}
    >
      {title}
    </button>
  );
}
function Toolbar({ type }: { type: DocumentType }) {
  const editor = useEditor();
  const [link, setLink] = useState("");
  const [showLink, setShowLink] = useState(false);
  const definition = schemas[type].fields.find((f) => f.name === "body")?.of;
  const styles = definition?.find((f) => f.type === "block")?.styles || [
    { title: "본문", value: "normal" },
    ...["h1", "h2", "h3", "h4", "h5", "h6"].map((v) => ({
      title: v.toUpperCase(),
      value: v,
    })),
    { title: "인용", value: "blockquote" },
  ];
  const activeStyle =
    useEditorSelector(editor, selectors.getActiveStyle) || "normal";
  return (
    <div className={s.toolbar} role="toolbar" aria-label="본문 작성 도구">
      <div className={s.toolbarRow}>
        <div className={s.toolbarGroup} role="group" aria-label="문단 서식">
          <span>문단</span>
          <select
            aria-label="문단 서식"
            value={activeStyle}
            onChange={(e) => {
              editor.send({ type: "style.toggle", style: e.target.value });
              editor.send({ type: "focus" });
            }}
          >
            {styles.map((style) => (
              <option key={style.value} value={style.value}>
                {style.value === "normal"
                  ? "본문"
                  : style.value === "blockquote"
                    ? "인용"
                    : style.value === "h2"
                      ? "큰 제목 (H2)"
                      : style.value === "h3"
                        ? "작은 제목 (H3)"
                        : style.title}
              </option>
            ))}
            {!styles.some((style) => style.value === activeStyle) && (
              <option value={activeStyle}>{activeStyle}</option>
            )}
          </select>
        </div>
        <div className={s.toolbarGroup} role="group" aria-label="글자 서식">
          <span>글자</span>
          {decorators.map((d) => (
            <MarkButton key={d.name} {...d} />
          ))}
        </div>
        <div className={s.toolbarGroup} role="group" aria-label="되돌리기">
          <button
            type="button"
            aria-label="실행 취소"
            title="실행 취소"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.send({ type: "history.undo" });
              editor.send({ type: "focus" });
            }}
          >
            ↶
          </button>
          <button
            type="button"
            aria-label="다시 실행"
            title="다시 실행"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              editor.send({ type: "history.redo" });
              editor.send({ type: "focus" });
            }}
          >
            ↷
          </button>
        </div>
      </div>
      <div className={s.toolbarRow}>
        <div className={s.toolbarGroup} role="group" aria-label="목록 서식">
          <span>목록</span>
          {["bullet", "number"].map((list) => (
            <button
              key={list}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.send({ type: "list item.toggle", listItem: list });
                editor.send({ type: "focus" });
              }}
            >
              {list === "bullet" ? "• 글머리" : "1. 번호"}
            </button>
          ))}
        </div>
        <div className={s.toolbarGroup} role="group" aria-label="본문에 삽입">
          <span>삽입</span>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowLink(!showLink)}
          >
            링크
          </button>
          {definition
            ?.filter((f) => f.type !== "block")
            .map((f) => (
              <button
                key={f.name || f.type}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  editor.send({
                    type: "insert.block object",
                    blockObject: {
                      name: f.name || f.type,
                      value:
                        f.name === "checklistBlock"
                          ? { items: [] }
                          : f.name === "tableBlock"
                            ? { rows: [] }
                            : {},
                    },
                    placement: "auto",
                  });
                  editor.send({ type: "focus" });
                }}
              >
                {f.type === "image"
                  ? "이미지"
                  : f.name === "tableBlock"
                    ? "표"
                    : "체크리스트"}
              </button>
            ))}
        </div>
      </div>
      {showLink && (
        <div className={s.inline}>
          <input
            aria-label="본문 링크 주소"
            value={link}
            placeholder="https://… 또는 /blog/…"
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            type="button"
            disabled={!/^(https?:\/\/|mailto:|tel:|\/[^/]|#)/i.test(link)}
            onClick={() => {
              editor.send({
                type: "annotation.add",
                annotation: { name: "link", value: { href: link } },
              });
              editor.send({ type: "focus" });
              setShowLink(false);
            }}
          >
            선택한 글자에 적용
          </button>
          <button
            type="button"
            onClick={() => {
              editor.send({
                type: "annotation.remove",
                annotation: { name: "link" },
              });
              editor.send({ type: "focus" });
              setShowLink(false);
            }}
          >
            링크 해제
          </button>
        </div>
      )}
    </div>
  );
}
function ObjectBlock({
  props,
  type,
  context,
}: {
  props: BlockRenderProps;
  type: DocumentType;
  context: MediaContext;
}) {
  const editor = useEditor();
  const value = props.value;
  const definition = schemas[type].fields
    .find((f) => f.name === "body")
    ?.of?.find((f) => (f.name || f.type) === value._type);
  const change = (name: string, v: unknown) =>
    editor.send({ type: "block.set", at: props.path, props: { [name]: v } });
  return (
    <div className={s.objectBlock}>
      <div contentEditable={false}>
        <div className={s.arrayHead}>
          <strong>
            {value._type === "image"
              ? "본문 이미지"
              : value._type === "checklistBlock" ? "체크리스트" : value._type === "tableBlock" ? "표" : definition?.title || value._type}
          </strong>
          <button
            type="button"
            onClick={() => {
              editor.send({
                type: "select",
                at: {
                  anchor: { path: props.path, offset: 0 },
                  focus: { path: props.path, offset: 0 },
                },
              });
              editor.send({ type: "delete", unit: "block" });
            }}
          >
            블록 삭제
          </button>
        </div>
        {value._type === "image" ? (
          <ImageField
            value={value}
            onChange={(v) =>
              editor.send({
                type: "block.set",
                at: props.path,
                props: v as Record<string, unknown>,
              })
            }
            path={`body.${value._key}`}
            context={context}
            alt
          />
        ) : (
          definition?.fields?.map((f) => (
            <SchemaField
              key={f.name}
              field={f}
              value={(value as Record<string, unknown>)[f.name]}
              onChange={(v) => change(f.name, v)}
              path={`body.${value._key}.${f.name}`}
              context={context}
            />
          ))
        )}
        {!definition && (
          <p>
            기존 사용자 정의 블록을 보존하고 있습니다. 이 형식의 입력 화면은
            아직 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
function preservedFields(
  records: Record<string, unknown>[],
  defaults: FieldDefinition[] = [],
): FieldDefinition[] {
  const fields = new Map(defaults.map((field) => [field.name, field]));
  for (const record of records)
    for (const [name, item] of Object.entries(record)) {
      if (name === "_key" || name === "_type" || fields.has(name)) continue;
      const type = Array.isArray(item)
        ? "array"
        : typeof item === "number"
          ? "number"
          : typeof item === "boolean"
            ? "boolean"
            : item && typeof item === "object"
              ? "object"
              : "string";
      fields.set(name, { name, type });
    }
  return [...fields.values()];
}
function listNumber(block: PortableTextBlock, blocks: PortableTextBlock[]) {
  const item = block as unknown as Record<string, unknown>;
  let count = 1;
  for (
    let i = blocks.findIndex((b) => b._key === block._key) - 1;
    i >= 0;
    i--
  ) {
    const previous = blocks[i] as unknown as Record<string, unknown>;
    if (
      previous._type !== "block" ||
      !previous.listItem ||
      Number(previous.level || 1) < Number(item.level || 1)
    )
      break;
    if (previous.level === item.level) {
      if (previous.listItem !== item.listItem) break;
      count++;
    }
  }
  return count;
}
export default function PortableBodyEditor({
  value,
  onChange,
  type,
  context,
}: {
  value: PortableTextBlock[] | undefined;
  onChange: (v: PortableTextBlock[]) => void;
  type: DocumentType;
  context: MediaContext;
}) {
  const [error, setError] = useState("");
  const [{ initialValue, repaired }] = useState(() => prepareBody(value));
  const [schemaDefinition] = useState(() => {
    const members =
      schemas[type].fields.find((f) => f.name === "body")?.of || [];
    return defineSchema({
      styles: [
        ...new Set([
          ...(members
            .find((f) => f.type === "block")
            ?.styles?.map((st) => st.value) || [
            "normal",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "blockquote",
          ]),
          ...(value || [])
            .filter((b) => b._type === "block")
            .map((b) => String(b.style || "normal")),
        ]),
      ].map((name) => ({ name })),
      decorators,
      lists: [{ name: "bullet" }, { name: "number" }],
      annotations: [
        ...new Set([
          "link",
          ...(value || [])
            .flatMap(
              (block) =>
                ((block as unknown as Record<string, unknown>).markDefs ||
                  []) as { _type: string }[],
            )
            .map((mark) => mark._type),
        ]),
      ].map((name) => ({
        name,
        fields: preservedFields(
          (value || [])
            .flatMap(
              (block) =>
                ((block as unknown as Record<string, unknown>).markDefs ||
                  []) as Record<string, unknown>[],
            )
            .filter((mark) => mark._type === name),
          name === "link" ? [{ name: "href", type: "string" }] : [],
        ),
      })),
      blockObjects: [
        ...new Set([
          ...members
            .filter((f) => f.type !== "block")
            .map((f) => f.name || f.type),
          ...(value || [])
            .filter((b) => b._type !== "block")
            .map((b) => b._type),
        ]),
      ].map((name) => {
        const member = members.find(
          (field) => (field.name || field.type) === name,
        );
        const fields: FieldDefinition[] =
          name === "image"
            ? [
                { name: "asset", type: "object" },
                { name: "alt", type: "string" },
                { name: "crop", type: "object" },
                { name: "hotspot", type: "object" },
              ]
            : (member?.fields || []).map((field) => ({
                name: field.name,
                type:
                  field.type === "array"
                    ? "array"
                    : field.type === "object"
                      ? "object"
                      : "string",
              }));
        return {
          name,
          fields: preservedFields(
            (value || []).filter((block) => block._type === name) as Record<
              string,
              unknown
            >[],
            fields,
          ),
        };
      }),
    });
  });
  return (
    <div className={s.portable}>
      {repaired && (
        <p className={s.repairNote}>
          원본 본문에 빠진 편집용 식별자를 보완했습니다. 본문을 수정하고 저장할
          때 함께 반영됩니다.
        </p>
      )}
      {error && (
        <p role="alert" className={s.error}>
          {error}
        </p>
      )}
      <EditorProvider initialConfig={{ schemaDefinition, initialValue }}>
        <EventListenerPlugin
          on={(event) => {
            if (event.type === "mutation") onChange(event.value || []);
            if (event.type === "invalid value")
              setError(
                "본문에 편집기가 지원하지 않는 구조가 있습니다. 원본을 보존했습니다. 원본 데이터에서 확인하세요.",
              );
          }}
        />
        <Toolbar type={type} />
        <PortableTextEditable
          className={s.editable}
          aria-label="본문 편집기"
          spellCheck={false}
          readOnly={!!error}
          renderDecorator={renderDecorator}
          renderStyle={renderStyle}
          renderAnnotation={(p) => (
            <span
              title={String(p.value.href || "")}
              style={{ textDecoration: "underline", color: "#7B2D3E" }}
            >
              {p.children}
            </span>
          )}
          renderBlock={(props) =>
            props.value._type === "block" ? (
              <div>{props.children}</div>
            ) : (
              <ObjectBlock props={props} type={type} context={context} />
            )
          }
          renderListItem={(p) => (
            <div
              className={s.listItem}
              data-list={p.value}
              data-marker={
                p.value === "number"
                  ? `${listNumber(p.block, value || [])}.`
                  : "•"
              }
            >
              {p.children}
            </div>
          )}
        />
      </EditorProvider>
    </div>
  );
}
