// components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <Navigation />
            <main>
                {children}
            </main>
            {/* Vous pouvez ajouter un footer ici si nécessaire */}
        </div>
    );
};

export default Layout;