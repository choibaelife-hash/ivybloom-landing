import { redirect } from 'next/navigation'

// 호스팅된 Sanity Studio로 리다이렉트 (React 18 환경에서 embedded studio 불가)
export default function StudioPage() {
  redirect('https://fxgjdpno.sanity.studio')
}
