import React from 'react';
import { Layout } from 'antd';
import '../styles/Footer.scss';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
    return (
        <AntFooter className="app-footer">
            <div className="footer-content">
                {/* Sekce - Speciální nabídky */}
                <div className="footer-top">
                    <div className="footer-item">
                        <h4>Exkluzivní nabídky každý den</h4>
                        <p>Objevte slevy a nabídky jen pro naše zákazníky.</p>
                    </div>
                    <div className="footer-item">
                        <h4>Expresní doručení</h4>
                        <p>Doručení do 24 hodin na většinu produktů.</p>
                    </div>
                    <div className="footer-item">
                        <h4>Podpora 24/7</h4>
                        <p>Naše zákaznická linka je zde pro vás nonstop.</p>
                    </div>
                    <div className="footer-item">
                        <h4>Bezpečný nákup</h4>
                        <p>Garantujeme ochranu vašich dat a bezpečné platby.</p>
                    </div>
                </div>


                {/* Sekce - Odkazy */}
                <div className="footer-bottom">
                    <div className="links">
                        <h5>Nakupování</h5>
                        <a href="#">Možnosti doručení</a>
                        <a href="#">Možnosti platby</a>
                        <a href="#">Reklamace a vrácení</a>
                        <a href="#">Obchodní podmínky</a>
                    </div>
                    <div className="links">
                        <h5>Objednávky</h5>
                        <a href="#">Stav objednávky</a>
                        <a href="#">Jak nakoupit</a>
                    </div>
                    <div className="links">
                        <h5>O nás</h5>
                        <a href="#">Kontakt</a>
                        <a href="#">Kariéra</a>
                        <a href="#">Aplikace</a>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                &copy; 2025 E-shop. Všechna práva vyhrazena.
            </div>
        </AntFooter>
    );
};

export default Footer;
