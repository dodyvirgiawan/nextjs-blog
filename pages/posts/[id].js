import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'

import Head from 'next/head'
import Date from '../../components/date'

import utilStyles from '../../styles/utils.module.css'

//! URUTAN KE-2 (AMBIL KONTEN ISI SESUAI DENGAN ID YANG DIDAPAT DARI GETSTATICPATHS)
export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id) //* by default params.id ini diperoleh dari function getAllPostIds yang ada di function getStaticPaths (dia nge return object dengan key paths)

    return {
        props: {
            postData,
        },
    }
}

//! URUTAN KE-1 (CARI DULU ID NYA YANG KEMUNGKINAN ADA, UNTUK KEBUUTHAN PRE RENDER)
export async function getStaticPaths() {
    const paths = getAllPostIds()

    return {
        paths, //* harus namanya paths https://nextjs.org/docs/basic-features/data-fetching#the-paths-key-required dan harus isi array of object (key params, dan isinya sesuai nama dynamic routingnya, yakni [id].js)
        fallback: false, //* any paths not returned by the function will result in 404 page.
    }
}

//! URUTAN KE-3 (PRE-RENDER KONTEN SESUAI DENGAN KONTEN YANG DIDAPAT DARI GETSTATICPROPS)
export default function Post({ postData }) {
    //* postData di dapet dari props yang direturn dari function getStaticProps
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>

            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}
