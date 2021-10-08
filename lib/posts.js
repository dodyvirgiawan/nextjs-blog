//* Static File Pre-rendering Demonstration
//* File ini dibuat untuk demonstrasiin fetching external data buat getStaticProps (pre-render nya next.js)
//* Disini method yang dipakai itu nge read file (fs) bukan nge fetch dari API
//* Jadi ini semua bisa direplace kalo mau fetch data dari sebuah API

//* Remark ini library buat convert markdown (.md) file ke HTML 
import remark from 'remark'
import html from 'remark-html'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // Ambil file name nya
    const fileNames = fs.readdirSync(postDirectory)

    // Ambil isi file nya pake gray-matter
    const allPostsData = fileNames.map((fileName) => {
        // id nya dari nama file (tanpa extension .md)
        const id = fileName.replace(/\.md$/, '')

        // Baca isi konten filenya
        const fullPath = path.join(postDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        // Di return ID dan juga isi konten file nya
        return {
            id,
            ...matterResult.data,
        }
    })

    // Di sort berdasarkan date
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1
        } else if (a > b) {
            return -1
        } else {
            return 0
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postDirectory)

    /**
     * Nge return sebuah array:
     *  [
     *      { params: { id: 'ssg-ssr' } },
     *      { params: { id: 'pre-rendering.md } }
     *  ]
     */
    //* Bentuk nya harus array of objects, karena bakal dipakai untuk getStaticPaths
    //* getStaticPaths harus berisi array of object, setiap object berisi params yang isinya nama file, di case ini kita mau dynamic routingnya itu [id].js
    //* Aturannya ada di https://nextjs.org/docs/basic-features/data-fetching#the-paths-key-required
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        }
    })
}

export async function getPostData(id) {
    // Baca file sesuai ID yang dikasih
    const fullPath = path.join(postDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Ambil isi kontennya
    const matterResult = matter(fileContents)

    // Pakai library remark buat convert markdown ke HTML string
    const processedContent = await remark().use(html).process(matterResult.content)
    const contentHtml = processedContent.toString()

    // Return sebuah object
    return {
        id,
        contentHtml,
        ...matterResult.data,
    }
}
