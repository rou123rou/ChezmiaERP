
import { CSSProperties } from 'react';

function AboutPage() {
    const primaryColor = '#AF5D24'; // Orange terreux
    const secondaryColor = '#F9FAFB'; // Blanc cassé
    
    const textColor = '#333'; // Noir pour le texte principal
    const montserratFont = 'Montserrat, sans-serif';
    const shadowColor = 'rgba(0, 0, 0, 0.1)';

    const containerStyle: CSSProperties = {
        backgroundColor: secondaryColor,
        paddingTop: '4rem',
        paddingBottom: '4rem',
        fontFamily: montserratFont,
        color: textColor,
    };

    const innerContainerStyle: CSSProperties = {
        maxWidth: '60rem',
        margin: '0 auto',
        paddingLeft: '1rem',
        paddingRight: '1rem',
    };

    const sectionStyle: CSSProperties = {
        marginBottom: '3rem',
    };

    const titleStyle: CSSProperties = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: primaryColor,
        marginBottom: '1.5rem',
        textAlign: 'center',
        textShadow: `1px 1px 2px ${shadowColor}`,
    };

    const subtitleStyle: CSSProperties = {
        fontSize: '2rem',
        fontWeight: 'semibold',
        color: primaryColor,
        marginBottom: '1.5rem',
        textAlign: 'center',
        textShadow: `1px 1px 2px ${shadowColor}`,
    };

    const paragraphStyle: CSSProperties = {
        fontSize: '1.1rem',
        lineHeight: '1.8',
        marginBottom: '1rem',
    };

    const strongTextStyle: CSSProperties = {
        fontWeight: 'bold',
    };

    const pointOfSaleCardStyle: CSSProperties = {
        backgroundColor: secondaryColor,
        boxShadow: `0 2px 4px ${shadowColor}`,
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '30rem',
        margin: '0 auto',
        marginBottom: '1rem',
    };

    const pointOfSaleTitleStyle: CSSProperties = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: textColor,
        marginBottom: '0.5rem',
    };

    const pointOfSaleTextStyle: CSSProperties = {
        color: '#777',
        marginBottom: '0.25rem',
    };

    return (
        <div style={containerStyle}>
            <div style={innerContainerStyle}>
                <section style={sectionStyle}>
                    <h1 style={titleStyle}>À Propos de Chez Mia</h1>
                    <p style={paragraphStyle}>
                        Chez Mia E-commerce, notre passion est de vous offrir des délices authentiques et savoureux. Nous sommes fiers de vous présenter nos pâtes Chamia, confectionnées avec le plus grand soin et un engagement inébranlable envers la qualité.
                    </p>
                    <p style={paragraphStyle}>
                        Notre secret réside dans la simplicité et la pureté de nos ingrédients. Nos pâtes Chamia sont <strong style={strongTextStyle}>100% naturelles</strong>, sans aucun additif ni conservateur. Nous croyons que la véritable saveur vient de la nature elle-même, et c'est pourquoi nous sélectionnons rigoureusement chaque composant pour vous garantir une qualité inégalée à chaque bouchée.
                    </p>
                    <p style={paragraphStyle}>
                        Découvrez des saveurs riches et authentiques qui évoquent la tradition et le savoir-faire artisanal. Nos Chamias sont parfaites pour accompagner vos moments de partage en famille, entre amis, ou tout simplement pour vous offrir un plaisir gourmand à tout moment de la journée.
                    </p>
                </section>

                <section style={sectionStyle}>
                    <h2 style={subtitleStyle}>Notre Engagement : La Qualité Naturelle</h2>
                    <p style={paragraphStyle}>
                        Notre engagement envers la naturalité est au cœur de tout ce que nous faisons. Nous sommes particulièrement fiers de notre <strong style={strongTextStyle}>Chamia sans sucre</strong>, notre produit phare et un véritable coup de cœur de nos clients. Cette délicieuse Chamia est préparée sans aucun sucre ajouté ni substitué. Contrairement à d'autres alternatives, nous n'utilisons aucun édulcorant, vous offrant ainsi le goût pur et authentique des ingrédients naturels.
                    </p>
                    <p style={paragraphStyle}>
                        Nous croyons qu'il est possible de se faire plaisir sainement, et notre Chamia sans sucre en est la preuve. Elle est idéale pour ceux qui surveillent leur consommation de sucre sans vouloir sacrifier la gourmandise.
                    </p>
                </section>

                <section style={sectionStyle}>
                    <h2 style={subtitleStyle}>Où Nous Trouver : Nos Points de Vente</h2>
                    <p style={{ ...paragraphStyle, textAlign: 'center' }}>
                        Vous pouvez retrouver nos délicieuses pâtes Chamia dans notre point de vente principal :
                    </p>
                    <div style={pointOfSaleCardStyle}>
                        <h3 style={pointOfSaleTitleStyle}>Sucré Salé - Menzah 5</h3>
                        <p style={pointOfSaleTextStyle}>15, Avenue Mouaouia Ibn Abi Sofiane</p>
                        <p style={pointOfSaleTextStyle}>Menzah 5, 2031</p>
                    </div>
                    {/* Vous pourriez ajouter d'autres points de vente ici si vous en avez */}
                </section>

                <section style={{ ...sectionStyle, textAlign: 'center' }}>
                    <h2 style={subtitleStyle}>Livraison Rapide et Fiable</h2>
                    <p style={paragraphStyle}>
                        Nous nous engageons à vous livrer vos commandes dans les plus brefs délais. Bénéficiez d'une <strong style={strongTextStyle}>livraison rapide entre 24H et 48H maximum</strong> pour savourer nos Chamias où que vous soyez.
                    </p>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;