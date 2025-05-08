import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaGift } from 'react-icons/fa';
import styles from './HomePage.module.css';
const PrimaryColor = '#AF5D24';
const BackgroundColor = '#ffd1a1';
const AccentColor = '#1976D2';
function HomePage() {
    const [, setIsBouncing] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsBouncing(true);
            setTimeout(() => setIsBouncing(false), 1000);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);
 return (
        <div className={styles.container}>
            <section className={styles.heroSection}>
                <div className={styles.heroBackground} />
                <h1 className={styles.heroTitle}>Bienvenue chez <span style={{ color: PrimaryColor }}>Mia</span>!</h1>
                <p className={styles.heroSubtitle}>Découvrez nos délicieuses chamias, préparées avec passion et les meilleurs ingrédients.</p>
                <div className={styles.heroButtons}>
                    <Link to="/products" className={styles.heroButton}>Voir tous les produits</Link>
                    <Link to="/a-propos" className={styles.heroButton}>En savoir plus</Link>
                </div>
            </section>
        

            <section className={styles.categoriesWhyUsSection} style={{ backgroundColor: BackgroundColor }}>
                <div className={styles.categoriesWhyUsContainer}>
                    <div className={styles.categoriesCard}>
                        <h2 className={styles.categoriesTitleCombined}>Nos Catégories Phares</h2>
                        <p className={styles.categoriesSubtitle}>Explorez notre variété de chamias artisanales.</p>
                        {/* Les liens vers les catégories spécifiques ont été supprimés */}
                    </div>
                    <div className={styles.whyChooseUsCard}>
                        <h2 className={styles.whyChooseUsTitleCombined}>Pourquoi Choisir Chez Mia ?</h2>
                        <div className={styles.whyChooseUsList}>
                            <div className={styles.whyChooseUsItemCombined}>
                                <div className={`${styles.whyChooseUsIconCombined} ${styles.qualityIconCombined}`}><FaCheckCircle /></div>
                            <p className={styles.whyChooseUsTextCombined}><strong>Ingrédients de Qualité supérieur 👌</strong><br />Sélectionnés avec soin pour un goût authentique✅.</p>
                            </div>
                            <div className={styles.whyChooseUsItemCombined}>
                                <div className={`${styles.whyChooseUsIconCombined} ${styles.artisanIconCombined}`}><FaClock /></div>
                                <p className={styles.whyChooseUsTextCombined}><strong>Préparation Artisanale 🫶</strong><br />Fait avec passion et savoir-faire traditionnel❤️‍🔥</p>
                            </div>
                            <div className={styles.whyChooseUsItemCombined}>
                                <div className={`${styles.whyChooseUsIconCombined} ${styles.deliveryIconCombined}`}><FaGift /></div>
                                <p className={styles.whyChooseUsTextCombined}><strong>Livraison Rapide 🚚</strong><br />Recevez vos chamias fraîches directement chez vous 📦.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.promotionsSection}>
                <h2 className={styles.promotionsTitle}>Nos Promotions du Moment</h2>
                <div className={styles.promotionContainer} style={{ backgroundColor: '#E3F2FD', borderColor: '#BBDEFB', color: '#1E88E5', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '1rem', color: '#141414', fontFamily: 'Montserrat, sans-serif' }}>Offre Spéciale lancement du siteweb 🥳 !</p>
                    <p className="text-gray-800 text-md mb-2" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '1.1rem', color: '#555' }}>
                        Profitez de <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: PrimaryColor }}>10%</span> de réduction sur votre première commande. Utilisez le code <span style={{ fontWeight: 'bold', color: AccentColor }}>ChezM25</span>.
                    </p>
                    <Link to="/products" className={styles.callToAction} style={{ marginTop: '1.5rem', padding: '1rem 2rem', fontSize: '1.1rem', display: 'inline-block' }}>Profiter de l'offre</Link>
                </div>
            </section>



            <section className={styles.howItWorksSection}>
                <h2 className={styles.howItWorksTitle}>Comment ça Marche ?</h2>
                <div className={styles.howItWorksSteps}>
                    <div className={styles.howItWorksStep}>
                        <div className={styles.howItWorksNumber} style={{ backgroundColor: '#81C784' }}>1</div>
                        <h3 className={styles.howItWorksStepTitle} style={{ color: '#388E3C' }}>Explorez Nos Délices</h3>
                        <p className="text-gray-800">Naviguez à travers notre sélection de chamias artisanales.</p>
                    </div>
                    <div className={styles.howItWorksStep}>
                        <div className={styles.howItWorksNumber} style={{ backgroundColor: '#64B5F6' }}>2</div>
                        <h3 className={styles.howItWorksStepTitle} style={{ color: '#1E88E5' }}>Choisissez Vos Favoris</h3>
                        <p className="text-gray-800">Sélectionnez les chamias qui vous tentent et ajoutez-les à votre panier.</p>
                    </div>
                    <div className={styles.howItWorksStep}>
                        <div className={styles.howItWorksNumber} style={{ backgroundColor: '#9FA8DA' }}>3</div>
                        <h3 className={styles.howItWorksStepTitle} style={{ color: '#3F51B5' }}>Savourez le Goût Mia</h3>
                        <p className="text-gray-800">Recevez votre commande rapidement et dégustez nos délicieuses chamias.</p>
                    </div>
                </div>
            </section>



            <section className={styles.commitmentsSection}>
                <h2 className={styles.commitmentsTitle}>Nos Engagements</h2>
                <div className={styles.commitmentsList}>
                    <div className={styles.commitmentCard}>
                        <svg className={styles.commitmentIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a4 4 0 004-4V3H3v12zM3 17l9-2 9 2m-9-2v8M3 5a2 2 0 012-2h14a2 2 0 012 2v2H3V5z" />
                        </svg>
                        <h3 className={styles.commitmentTitle}>Souci de la Qualité</h3>
                        <p className="text-gray-800">Nous mettons tout en œuvre pour vous offrir des produits de la plus haute qualité.</p>
                    </div>
                    <div className={styles.commitmentCard}>
                        <svg className={styles.commitmentIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className={styles.commitmentTitle}>Passion et Authenticité</h3>
                        <p className="text-gray-800">Chaque chamia est le fruit d'un savoir-faire artisanal et d'une véritable passion.</p>
                    </div>
                </div>
            </section>


            <section className={`${styles.faqSection} ${styles.spacedFaqSection}`}>
             <h2 className={styles.faqTitle}>Questions Fréquemment Posées</h2>
                <div className={styles.faqContainer}>
                    <div className={styles.faqItem} style={{ borderLeftColor: '#4CAF50' }}>
                        <h4 className={styles.faqQuestion}>Quels sont vos délais de livraison ?</h4>
                        <p className="text-gray-700 text-sm">Nos délais de livraison sont généralement de 2 à 4 jours ouvrables.</p>
                    </div>
                    <div className={styles.faqItem} style={{ borderLeftColor: '#2196F3' }}>
                        <h4 className={styles.faqQuestion}>Proposez-vous des options sans sucre ?</h4>
                        <p className="text-gray-700 text-sm">Oui, nous avons une délicieuse gamme de chamias sans sucre.</p>
                    </div>
                    <div className={styles.faqItem} style={{ borderLeftColor: '#FF9800' }}>
                        <h4 className={styles.faqQuestion}>Où sont préparées vos chamias ?</h4>
                        <p className="text-gray-700 text-sm">Toutes nos chamias sont préparées avec soin dans notre atelier en Tunisie.</p>
                    </div>
                </div>
            </section>


            <footer className={styles.combinedFooter}>
    <div className={styles.footerContainer}>
        <div className={styles.connectSection}>
            <h2 className={styles.connectTitle}>Restez Connecté avec <span style={{ color: '#388E3C' }}>Mia</span> !</h2>
            <p className={styles.connectSubtitle}>Suivez-nous sur nos réseaux sociaux pour ne rien manquer de nos nouveautés, promotions et moments gourmands !</p>
            <div className={styles.socialLinks}>
                            <Link to="https://www.facebook.com/ChezMiaTunisie?locale=fr_FR" className={styles.socialLink}><svg className="h-10 w-10 fill-current" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.46 2.91 8.17 6.8 9.49v-6.98h-2.03v-2.51h2.03V9.79c0-2.28 1.39-3.53 3.42-3.53 1 0 1.93.08 2.2.11v2.33h-1.5c-1.11 0-1.33.53-1.33 1.32v1.73h2.69l-.35 2.51h-2.34v6.98c3.89-1.32 6.8-5.03 6.8-9.49 0-5.52-4.48-10-10-10z"/></svg><span className="sr-only">Suivez-nous sur Facebook</span></Link>
                            <Link to="https://www.instagram.com/chez_mia_tunisie/" className={styles.socialLink}><svg className="h-10 w-10 fill-current" viewBox="0 0 24 24"><path fill="currentColor" d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27m0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666z"/><path fill="currentColor" d="M21.56 5.162c-.186-.346-.63-.578-1.045-.578-.416 0-.859.232-1.045.578-.186.347-.055.784.13.968.186.346.63.578 1.045.578.416 0 .859-.232 1.045.578.185-.346.055-.784-.13-.968z"/></svg><span className="sr-only">Suivez-nous sur Instagram</span></Link>
                            <Link to="https://www.tiktok.com/@chezmiatunisie?lang=fr" className={styles.socialLink}><svg className="h-10 w-10 fill-current" viewBox="0 0 24 24"><path d="M20.165 3.015c.32.18.58.455.715.785.135.33.2.7.2 1.095v8.11c0 .395-.065.765-.2 1.095-.135.33-.395.605-.715.785-.32.18-.69.27-1.095.27h-2.835v-10.8h2.835c.405 0 .775.09 1.095.27zM14.83 12.015v-2.835c.09-.055.18-.11.27-.165v2.995h-2.745v-2.995c.09-.055.18-.11.27-.165v2.995h-2.745v-6.21c.395.055.765.165 1.095.33.33.165.585.44.765.765v2.145c-.32-.18-.69-.27-1.095-.27h-2.835v6.21h2.835c.405 0 .775-.09 1.095-.27.32-.18.58-.455.715-.785.135-.33.2-.7.2-1.095v-2.09c.32.18.69.27 1.095.27h2.835z"/></svg><span className="sr-only">Suivez-nous sur TikTok</span></Link>
                        </div>
                        <div className={styles.newsletterForm}>
                            <form className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                                <input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    className={styles.newsletterInput}
                                />
                                <button
                                    type="submit"
                                    className={styles.callToAction}
                                >
                                    S'inscrire à notre Newsletter
                                </button>
                            </form>
                        </div>
                    </div>
                    <hr className={styles.footerDivider} />
        <div className={styles.mainFooter}>
            <p className="mb-2">Tous droits réservés © 2025 Chez Mia</p>
            <p className="mb-2">Produit 100% Tunisien | Préparé avec passion</p>
            <div className={styles.footerLinks}>
                <Link to="/conditions-generales" className={styles.footerLink}>Conditions Générales de Vente</Link>
                <span className={styles.footerSeparator}>|</span>
                <Link to="/politique-de-confidentialite" className={styles.footerLink}>Politique de Confidentialité</Link>
                <span className={styles.footerSeparator}>|</span>
                <Link to="/contact" className={styles.footerLink}>Contact</Link>
            </div>
        </div>
    </div>
</footer>
        </div>
    );
}

export default HomePage;