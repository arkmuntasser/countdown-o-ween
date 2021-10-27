/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { getYear, isBefore, differenceInCalendarDays } from 'date-fns';
import styles from '../styles/Home.module.css'

function Canvas(props) {
	const canvasRef = useRef(null);
	const imageRef = useRef(null);
	const [imageReady, setImageReady] = useState(false);
	const [imageString, setImageString] = useState(null);

	useEffect(() => {
		const currentDate = new Date();
		const currentYear = getYear(currentDate) ;

		const halloweenDate = new Date(currentYear, 9, 31);

		const currentDateBeforeHalloween = isBefore(currentDate, halloweenDate);

		let days = 0;
		if (currentDateBeforeHalloween) {
			days = differenceInCalendarDays(halloweenDate, currentDate);
		} else {
			const newHalloweenDate = new Date(currentYear + 1, 9, 31);
			days = differenceInCalendarDays(newHalloweenDate, currentDate);
		}

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		const image = imageRef.current;

		// Draw base image
		ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

		// Black out text from bottom image
		ctx.fillStyle = '#000';
		ctx.rect(canvas.width / 2.3, canvas.height * .96, canvas.width * .07, canvas.height * 0.026);
		ctx.fill();

		// Black out text from top image
		ctx.fillStyle = '#000';
		ctx.rect(canvas.width / 3.1, canvas.height / 2.25, canvas.width * .06, canvas.height * 0.026);
		ctx.fill();

		// Write top text
		ctx.font = '28px arial bold';
		ctx.fillStyle = '#fff';
		ctx.fillText(days + 1, canvas.width / 3.1, canvas.height / 2.14);

		// Write bottom text
		ctx.fillText(days, canvas.width / 2.3, canvas.height * .983);

		setImageString(canvas.toDataURL('image/png'));
	}, [imageReady]);

	function downloadImage() {
		const link = document.createElement('a');
		link.download = 'days-until-halloween.png';
		link.href = imageString;
		link.click();
	}

	return (
		<section className={styles.widget}>
			<h1 className={styles.title}>Countdown-o-ween</h1>
			<img ref={imageRef} src="/meme.jpg" alt="Halloween" loading="eager" onLoad={() => setImageReady(true)} />
			<canvas className={styles.canvas} ref={canvasRef} {...props}></canvas>
			<button className={styles.download} onClick={downloadImage}>Download Image</button>
			<Head>
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:creator" content="@arkmuntasser"/>
				<meta name="twitter:title" content="Countdown-o-ween"/>
				<meta name="twitter:description" content="A meme-tastic countdown until halloween every halloween"/>
				<meta name="twitter:image" content={imageString}/>
			</Head>
		</section>
	)
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Countdown-o-ween</title>
        <meta name="description" content="A meme-tastic countdown until halloween every halloween" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

			<Canvas width={800} height={800} />

    </div>
  )
}
