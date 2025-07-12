import React from 'react'

const useMobile = () => {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

    React.useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth <= 992)
        }
        checkSize();
        window.addEventListener("resize", checkSize)
        return () => window.removeEventListener('resize', checkSize)
    }, [])

    return isMobile
}

export default useMobile