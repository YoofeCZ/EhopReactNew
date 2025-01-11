// src/components/AppLayout.tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { Layout as AntLayout } from 'antd';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import '../styles/Layout.scss';

const { Header, Content } = AntLayout;

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <AntLayout className="app-layout">
            {/* Navbar */}
            <Header className="app-header">
                <Navbar />
            </Header>

            {/* Sidebar pod navbarem */}
            <div className={`app-sidebar ${isMobile ? 'app-sidebar-mobile' : ''}`}>
                <Sidebar />
            </div>

            {/* Reklamy a obsah */}
            <AntLayout className="app-body">
                {/* Levý reklamní prostor */}
                {!isMobile && (
                    <div className="ad-space-left">
                        <img src="/images/leva.jpg" alt="Reklama vlevo" className="ad-image" />
                    </div>
                )}

                {/* Obsah */}
                <Content className="app-content">
                    {children}
                </Content>

                {/* Pravý reklamní prostor */}
                {!isMobile && (
                    <div className="ad-space-right">
                        <img src="/images/prava.jpg" alt="Reklama vpravo" className="ad-image" />
                    </div>
                )}
            </AntLayout>

            {/* Footer */}
            <Footer />
        </AntLayout>
    );
};

export default AppLayout;
