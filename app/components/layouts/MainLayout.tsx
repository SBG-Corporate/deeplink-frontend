import { FC } from 'react';
import Head from 'next/head';
import { Box, useMediaQuery } from '@mui/material';
import Navbar from '../ui/Navbar';
import LateralNavbarV2 from '../home/LateralNavbarV2';

interface Props {
    title: string;
    pageDescription: string;
    imageFullUrl?: string;
    children: React.ReactNode;
    showNavbars?: boolean;
}

export const MainLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl, showNavbars = true }) => {
    const isNonMobileScreens = useMediaQuery("(min-width:800px)");
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={pageDescription} />
                <meta name="og:title" content={title} />
                <meta name="og:description" content={pageDescription} />
                {
                    imageFullUrl && (
                        <meta name="og:image" content={imageFullUrl} />
                    )
                }
            </Head>

            {showNavbars &&
                <>
                    <Navbar />
                    {isNonMobileScreens && <LateralNavbarV2 />}
                </>
            }

            <main>
                <Box height="100%">
                    {children}
                </Box>
            </main>

            {/* <footer></footer> */}
        </>
    )
}


