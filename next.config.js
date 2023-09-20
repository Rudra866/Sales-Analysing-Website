/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    experimental: {
        appDir: true,
    },
    images: {
        domains: ['images.unsplash.com', 'images.pexels.com','assets.zyrosite.com', 'source.unsplash.com'],
    },
}

module.exports = nextConfig
