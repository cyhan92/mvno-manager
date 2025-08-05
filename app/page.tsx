'use client'
import dynamic from 'next/dynamic'
import Loading from '../components/Loading'

const ClientHome = dynamic(() => import('../components/ClientHome'), {
  ssr: false,
  loading: () => <Loading />
})

export default function Home() {
  return <ClientHome />
}
