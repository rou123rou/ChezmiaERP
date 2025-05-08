// frontend/src/pages/AboutPage/AboutPage.tsx
import styles from './AboutPage.module.css';
function AboutPage() {
    return (
        <div className={styles.aboutPageContainer}>
            <div className={styles.innerContainer}>
                <section className={styles.section}>
                    <h1 className={styles.title}>À Propos de Chez Mia</h1>
                    <p className={styles.paragraph}>
                        Chez Mia E-commerce, notre passion est de vous offrir des délices authentiques et savoureux. Nous sommes fiers de vous présenter nos pâtes Chamia, confectionnées avec le plus grand soin et un engagement inébranlable envers la qualité.
                    </p>
                    <p className={styles.paragraph}>
                        Notre secret réside dans la simplicité et la pureté de nos ingrédients. Nos pâtes Chamia sont <strong className={styles.strongText}>100% naturelles</strong>, sans aucun additif ni conservateur. Nous croyons que la véritable saveur vient de la nature elle-même, et c'est pourquoi nous sélectionnons rigoureusement chaque composant pour vous garantir une qualité inégalée à chaque bouchée.
                    </p>
                    <p className={styles.paragraph}>
                        Découvrez des saveurs riches et authentiques qui évoquent la tradition et le savoir-faire artisanal. Nos Chamias sont parfaites pour accompagner vos moments de partage en famille, entre amis, ou tout simplement pour vous offrir un plaisir gourmand à tout moment de la journée.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.subtitle}>Notre Engagement : La Qualité Naturelle</h2>
                    <p className={styles.paragraph}>
                        Notre engagement envers la naturalité est au cœur de tout ce que nous faisons. Nous sommes particulièrement fiers de notre <strong className={styles.strongText}>Chamia sans sucre</strong>, notre produit phare et un véritable coup de cœur de nos clients. Cette délicieuse Chamia est préparée sans aucun sucre ajouté ni substitué. Contrairement à d'autres alternatives, nous n'utilisons aucun édulcorant, vous offrant ainsi le goût pur et authentique des ingrédients naturels.
                    </p>
                    <p className={styles.paragraph}>
                        Nous croyons qu'il est possible de se faire plaisir sainement, et notre Chamia sans sucre en est la preuve. Elle est idéale pour ceux qui surveillent leur consommation de sucre sans vouloir sacrifier la gourmandise.
                    </p>
                </section>

                <section className={`${styles.section} ${styles.pointsOfSaleSection}`}>
                    <h2 className={styles.subtitle}>Où Nous Trouver : Nos Points de Vente</h2>
                    <p className={styles.paragraph} style={{ textAlign: 'center' }}>
                        Vous pouvez retrouver nos délicieuses pâtes Chamia dans notre point de vente principal :
                    </p>
                    <div className={styles.pointsOfSaleContainer}>
                        <div className={styles.pointOfSaleCard}>
                            <h3 className={styles.pointOfSaleTitle}>Sucré Salé - Menzah 5</h3>
                            <p className={styles.pointOfSaleText}>15, Avenue Mouaouia Ibn Abi Sofiane</p>
                            <p className={styles.pointOfSaleText}>Menzah 5, 2031</p>
                        </div>
                        {/* Vous pourriez ajouter d'autres points de vente ici si vous en avez */}
                    </div>
                </section>

                <section className={`${styles.section} ${styles.deliverySection}`}>
                    <h2 className={styles.subtitle} style={{ textAlign: 'center' }}>Livraison Rapide et Fiable</h2>
                    <p className={styles.paragraph} style={{ textAlign: 'center' }}>
                        Nous nous engageons à vous livrer vos commandes dans les plus brefs délais. Bénéficiez d'une <strong className={styles.strongText}>livraison rapide entre 24H et 48H maximum</strong> pour savourer nos Chamias où que vous soyez.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;