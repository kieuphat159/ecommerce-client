import './Hero.css'

export default function Hero({ image, title, description }) {
    return (
        <section className='hero'>
            <div className='hero__background'>
                <img src={image} alt="products hero" />
                <div className='hero__content'>
                    <div className="hero__title">
                        {title}
                    </div>
                    <div className='hero__description'>{description}</div>
                </div>

            </div>
        </section>
    );
}
