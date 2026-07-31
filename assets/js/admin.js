(function () {
	'use strict';

	const app = document.getElementById('mrspb-builder');
	if ( ! app ) return;

	const postId = app.dataset.postId;
	const initial = JSON.parse(document.getElementById('mrspb-initial').textContent || '{}');

	const animOptions = [
		{ value: '', name: 'None' },
		{ value: 'fade', name: 'AOS Fade' },
		{ value: 'fade-up', name: 'AOS Fade Up' },
		{ value: 'fade-down', name: 'AOS Fade Down' },
		{ value: 'fade-left', name: 'AOS Fade Left' },
		{ value: 'fade-right', name: 'AOS Fade Right' },
		{ value: 'zoom-in', name: 'AOS Zoom In' },
		{ value: 'zoom-out', name: 'AOS Zoom Out' },
		{ value: 'flip-up', name: 'AOS Flip Up' },
		{ value: 'flip-left', name: 'AOS Flip Left' }
	];

	const gsapOptions = [
		{ value: '', name: 'None' },
		{ value: 'fade', name: 'GSAP Fade' },
		{ value: 'slide-up', name: 'GSAP Slide Up' },
		{ value: 'slide-down', name: 'GSAP Slide Down' },
		{ value: 'slide-left', name: 'GSAP Slide Left' },
		{ value: 'slide-right', name: 'GSAP Slide Right' },
		{ value: 'zoom-in', name: 'GSAP Zoom In' },
		{ value: 'zoom-out', name: 'GSAP Zoom Out' },
		{ value: 'flip-left', name: 'GSAP Flip Left' },
		{ value: 'bounce', name: 'GSAP Bounce' }
	];

	const visibilityOptions = [
		{ value: '', name: 'Show All' },
		{ value: 'mrspb-hide-desktop', name: 'Hide on Desktop' },
		{ value: 'mrspb-hide-tablet', name: 'Hide on Tablet' },
		{ value: 'mrspb-hide-mobile', name: 'Hide on Mobile' }
	];

	const blocks = [
		// Layout
		{ id: 'section', label: 'Section', category: 'Layout', content: `<section class="mrspb-section" style="padding: 60px 20px; background: #f8fafc;"></section>` },
		{ id: 'container', label: 'Container', category: 'Layout', content: `<div class="mrspb-container" style="max-width: 1200px; margin: 0 auto; padding: 20px;"></div>` },
		{ id: 'row-2', label: '2 Columns', category: 'Layout', content: `<div class="mrspb-row" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;"><div class="mrspb-col" style="min-height: 80px; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px;"></div><div class="mrspb-col" style="min-height: 80px; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px;"></div></div>` },
		{ id: 'row-3', label: '3 Columns', category: 'Layout', content: `<div class="mrspb-row" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;"><div class="mrspb-col" style="min-height: 80px; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px;"></div><div class="mrspb-col" style="min-height: 80px; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px;"></div><div class="mrspb-col" style="min-height: 80px; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px;"></div></div>` },

		// Sections
		{ id: 'hero', label: 'Hero', category: 'Sections', content: { tagName: 'section', classes: ['mrspb-hero'], attributes: { 'data-gsap': 'fade' }, style: { padding: '100px 20px', background: 'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)', color: '#fff', 'text-align': 'center' }, components: [{ tagName: 'div', classes: ['mrspb-container'], style: { 'max-width': '800px', margin: '0 auto' }, components: [{ type: 'text', tagName: 'h1', content: 'Build Something Amazing', attributes: { 'data-gsap': 'slide-up' }, style: { 'font-size': '48px', 'margin-bottom': '20px', color: '#fff' } }, { type: 'text', tagName: 'p', content: 'Drag, drop and style every element with Page Builder Pro.', attributes: { 'data-gsap': 'slide-up' }, style: { 'font-size': '18px', 'line-height': '1.6', 'margin-bottom': '30px', opacity: '0.9', color: '#fff' } }, { type: 'link', content: 'Get Started', attributes: { 'data-gsap': 'zoom-in' }, style: { display: 'inline-block', padding: '14px 32px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none', 'font-weight': '600' } }] }] } },
		{ id: 'cta', label: 'Call to Action', category: 'Sections', content: { tagName: 'section', classes: ['mrspb-cta'], attributes: { 'data-gsap': 'fade' }, style: { padding: '80px 20px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', 'text-align': 'center' }, components: [{ tagName: 'div', style: { 'max-width': '800px', margin: '0 auto' }, components: [{ type: 'text', tagName: 'h2', content: 'Ready to start?', attributes: { 'data-gsap': 'slide-up' }, style: { 'font-size': '36px', 'margin-bottom': '15px' } }, { type: 'text', tagName: 'p', content: 'Join thousands of happy customers.', attributes: { 'data-gsap': 'slide-up' }, style: { 'font-size': '18px', opacity: '0.9', 'margin-bottom': '30px' } }, { type: 'link', content: 'Get Started', attributes: { 'data-gsap': 'zoom-in' }, style: { display: 'inline-block', padding: '14px 32px', background: '#fff', color: '#2563eb', 'border-radius': '6px', 'text-decoration': 'none', 'font-weight': '600' } }] }] } },
		{ id: 'feature-box', label: 'Feature Box', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-feature-box'], style: { padding: '30px', 'background-color': '#fff', 'border-radius': '12px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)', 'text-align': 'center' }, components: [{ tagName: 'div', content: '⭐', style: { 'font-size': '40px', 'margin-bottom': '15px' } }, { type: 'text', tagName: 'h3', content: 'Feature Title', style: { 'font-size': '22px', 'margin-bottom': '10px' } }, { type: 'text', tagName: 'p', content: 'Describe the value of this feature in a few lines.', style: { color: '#475569' } }] } },
		{ id: 'pricing-table', label: 'Pricing Table', category: 'Sections', content: { tagName: 'section', style: { padding: '60px 20px', 'background-color': '#f8fafc' }, components: [{ tagName: 'div', style: { 'max-width': '1200px', margin: '0 auto', 'text-align': 'center' }, components: [{ type: 'text', tagName: 'h2', content: 'Pricing Plans', style: { 'font-size': '36px', 'margin-bottom': '40px' } }, { tagName: 'div', style: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }, components: [{ tagName: 'div', style: { width: '100%', 'background-color': '#fff', 'border-radius': '12px', padding: '30px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)' }, components: [{ type: 'text', tagName: 'h3', content: 'Basic' }, { type: 'text', tagName: 'p', content: '$9/mo', style: { 'font-size': '24px', 'font-weight': '700' } }, { type: 'text', tagName: 'p', content: 'Essential features.' }, { type: 'link', content: 'Choose', style: { display: 'inline-block', padding: '10px 20px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none' } }] }, { tagName: 'div', style: { width: '100%', 'background-color': '#fff', 'border-radius': '12px', padding: '30px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)', border: '2px solid #2563eb' }, components: [{ type: 'text', tagName: 'h3', content: 'Pro' }, { type: 'text', tagName: 'p', content: '$29/mo', style: { 'font-size': '24px', 'font-weight': '700' } }, { type: 'text', tagName: 'p', content: 'Advanced tools.' }, { type: 'link', content: 'Choose', style: { display: 'inline-block', padding: '10px 20px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none' } }] }, { tagName: 'div', style: { width: '100%', 'background-color': '#fff', 'border-radius': '12px', padding: '30px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)' }, components: [{ type: 'text', tagName: 'h3', content: 'Agency' }, { type: 'text', tagName: 'p', content: '$79/mo', style: { 'font-size': '24px', 'font-weight': '700' } }, { type: 'text', tagName: 'p', content: 'Full power.' }, { type: 'link', content: 'Choose', style: { display: 'inline-block', padding: '10px 20px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none' } }] }] }] }] } },
		{ id: 'testimonial', label: 'Testimonial', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-testimonial'], style: { padding: '40px', 'background-color': '#fff', 'border-radius': '12px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)', 'text-align': 'center' }, components: [{ type: 'text', tagName: 'p', content: '"This page builder completely changed how we launch landing pages."', style: { 'font-size': '20px', 'font-style': 'italic', color: '#334155', 'margin-bottom': '20px' } }, { type: 'text', tagName: 'h4', content: 'Jane Doe', style: { 'font-size': '18px', 'font-weight': '600' } }, { type: 'text', tagName: 'p', content: 'CEO, Example Inc.', style: { color: '#64748b' } }] } },
		{ id: 'counter', label: 'Counter', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-counter'], style: { padding: '40px', 'background-color': '#f1f5f9', 'border-radius': '12px', 'text-align': 'center' }, components: [{ type: 'text', tagName: 'div', content: '1,000+', style: { 'font-size': '48px', 'font-weight': '700', color: '#2563eb' } }, { type: 'text', tagName: 'p', content: 'Happy Customers', style: { color: '#475569' } }] } },
		{ id: 'progress-bar', label: 'Progress Bar', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-progress'], style: { padding: '20px' }, components: [{ type: 'text', tagName: 'p', content: 'Skill Level', style: { 'margin-bottom': '8px' } }, { tagName: 'div', style: { width: '100%', height: '20px', 'background-color': '#e2e8f0', 'border-radius': '10px', overflow: 'hidden' }, components: [{ tagName: 'div', style: { width: '75%', height: '100%', 'background-color': '#2563eb' } }] }] } },
		{ id: 'team-member', label: 'Team Member', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-team'], style: { padding: '24px', 'background-color': '#fff', 'border-radius': '12px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)', 'text-align': 'center' }, components: [{ type: 'image', classes: ['mrspb-team-avatar'], style: { width: '120px', height: '120px', 'border-radius': '50%', 'object-fit': 'cover', 'margin-bottom': '15px' } }, { type: 'text', tagName: 'h4', content: 'Team Member', style: { 'font-size': '20px', 'margin-bottom': '5px' } }, { type: 'text', tagName: 'p', content: 'Role / Position', style: { color: '#64748b' } }] } },
		{ id: 'faq', label: 'FAQ Accordion', category: 'Sections', content: `<div class="mrspb-faq" style="max-width: 800px; margin: 0 auto;"><div class="mrspb-faq-item" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px;"><div class="mrspb-faq-question" style="padding: 15px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between;"><span>Question 1?</span><span>+</span></div><div class="mrspb-faq-answer" style="padding: 0 15px; color: #475569;"><p>Answer to question 1.</p></div></div><div class="mrspb-faq-item" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px;"><div class="mrspb-faq-question" style="padding: 15px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between;"><span>Question 2?</span><span>+</span></div><div class="mrspb-faq-answer" style="padding: 0 15px; color: #475569;"><p>Answer to question 2.</p></div></div></div>` },
		{ id: 'newsletter', label: 'Newsletter', category: 'Sections', content: `<form class="mrspb-form" data-form-id="newsletter" style="max-width: 500px; margin: 0 auto; padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,.05); text-align: center;"><h3 style="margin-top: 0;">Subscribe to our newsletter</h3><p style="color: #475569;">Get the latest updates right in your inbox.</p><div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;"><input type="email" name="email" placeholder="Enter your email" required style="flex: 1; min-width: 200px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;"><button type="submit" style="padding: 12px 24px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Subscribe</button></div></form>` },
		{ id: 'cookie-banner', label: 'Cookie Banner', category: 'Sections', content: `<div class="mrspb-cookie-banner" style="position: fixed; bottom: 0; left: 0; right: 0; background: #1e293b; color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999;"><p style="margin: 0;">We use cookies to improve your experience.</p><button class="mrspb-cookie-accept" style="padding: 8px 16px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Accept</button></div>` },

		// Basic
		{ id: 'heading', label: 'Heading', category: 'Basic', content: { type: 'text', tagName: 'h2', content: 'Heading', style: { padding: '10px', 'font-size': '32px', color: '#0f172a' } } },
		{ id: 'text', label: 'Text', category: 'Basic', content: { type: 'text', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', style: { padding: '10px', color: '#334155' } } },
		{ id: 'image', label: 'Image', category: 'Basic', content: { type: 'image', classes: ['mrspb-image'], style: { padding: '10px', 'max-width': '100%', 'border-radius': '8px' } } },
		{ id: 'button', label: 'Button', category: 'Basic', content: { type: 'link', classes: ['mrspb-button'], content: 'Click me', style: { display: 'inline-block', padding: '12px 24px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none', 'font-weight': '600' } } },
		{ id: 'spacer', label: 'Spacer', category: 'Basic', content: { tagName: 'div', classes: ['mrspb-spacer'], style: { height: '60px' } } },
		{ id: 'divider', label: 'Divider', category: 'Basic', content: { tagName: 'hr', classes: ['mrspb-divider'], style: { border: 'none', 'border-top': '1px solid #cbd5e1', margin: '20px 0' } } },
		{ id: 'icon', label: 'SVG Icon', category: 'Basic', content: `<div class="mrspb-icon" style="display: inline-block; width: 48px; height: 48px; color: #2563eb;"><svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 2L2 22h20L12 2z"></path></svg></div>` },

		// Media
		{ id: 'video', label: 'Video Embed', category: 'Media', content: `<div class="mrspb-video" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #0f172a;"><iframe src="" style="position: absolute; inset: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe></div>` },
		{ id: 'map', label: 'Map', category: 'Media', content: `<div class="mrspb-map" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://maps.google.com/maps?q=&output=embed" style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe></div>` },
		{ id: 'carousel', label: 'Carousel', category: 'Media', content: `<div class="swiper mrspb-swiper" style="width: 100%;"><div class="swiper-wrapper"><div class="swiper-slide" style="display: flex; align-items: center; justify-content: center; min-height: 200px; background: #e2e8f0;">Slide 1</div><div class="swiper-slide" style="display: flex; align-items: center; justify-content: center; min-height: 200px; background: #cbd5e1;">Slide 2</div><div class="swiper-slide" style="display: flex; align-items: center; justify-content: center; min-height: 200px; background: #94a3b8;">Slide 3</div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>` },
		{ id: 'lottie', label: 'Lottie Animation', category: 'Media', content: `<div class="mrspb-lottie" data-url="https://assets10.lottiefiles.com/packages/lf20_u4yrau.json" style="width: 300px; height: 300px; margin: 0 auto;"></div>` },

		// Interactive
		{ id: 'tabs', label: 'Tabs', category: 'Interactive', content: `<div class="mrspb-tabs" style="max-width: 800px; margin: 0 auto;"><div style="display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; margin-bottom: 20px;"><button style="padding: 10px 20px; background: #2563eb; color: #fff; border: none; border-radius: 6px 6px 0 0;">Tab 1</button><button style="padding: 10px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px 6px 0 0;">Tab 2</button></div><div style="padding: 20px; background: #fff; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,.05);"><h3>Tab 1</h3><p>First tab panel content.</p></div></div>` },
		{ id: 'accordion', label: 'Accordion', category: 'Interactive', content: `<div class="mrspb-accordion" style="max-width: 800px; margin: 0 auto;"><details style="margin-bottom: 10px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;"><summary style="font-weight: 600; cursor: pointer;">Accordion Item 1</summary><p style="margin-top: 10px; color: #475569;">First accordion content.</p></details></div>` },
		{ id: 'countdown', label: 'Countdown', category: 'Interactive', content: `<div class="mrspb-countdown" data-target-date="2026-12-31T23:59:59" style="display: flex; gap: 20px; justify-content: center; padding: 40px 20px; background: #f8fafc; border-radius: 12px;"><div style="text-align: center;"><div data-countdown-part="days" style="font-size: 48px; font-weight: 700; color: #2563eb;">00</div><div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Days</div></div><div style="text-align: center;"><div data-countdown-part="hours" style="font-size: 48px; font-weight: 700; color: #2563eb;">00</div><div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Hours</div></div><div style="text-align: center;"><div data-countdown-part="minutes" style="font-size: 48px; font-weight: 700; color: #2563eb;">00</div><div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Minutes</div></div><div style="text-align: center;"><div data-countdown-part="seconds" style="font-size: 48px; font-weight: 700; color: #2563eb;">00</div><div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Seconds</div></div></div>` },
		{ id: 'form', label: 'Contact Form', category: 'Interactive', content: `<form class="mrspb-form" data-form-id="contact" style="max-width: 600px; margin: 0 auto; padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,.05);"><h3 style="margin-top: 0;">Contact Us</h3><div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: 600;">Name</label><input type="text" name="name" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;"></div><div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: 600;">Email</label><input type="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;"></div><div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: 600;">Message</label><textarea name="message" rows="4" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;"></textarea></div><button type="submit" style="padding: 12px 24px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Send Message</button></form>` },
		{ id: 'search', label: 'Search Form', category: 'Interactive', content: `<form class="mrspb-search-form" method="get" action="/" style="display: flex; gap: 10px; max-width: 500px; margin: 0 auto;"><input type="text" name="s" placeholder="Search..." style="flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;"><button type="submit" style="padding: 12px 24px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Search</button></form>` },
		{ id: 'star-rating', label: 'Star Rating', category: 'Interactive', content: `<div class="mrspb-star-rating" data-rating="4.5" style="font-size: 24px; color: #fbbf24; letter-spacing: 2px;">★★★★★</div>` },

		// Dynamic
		{ id: 'post-title', label: 'Post Title', category: 'Dynamic', content: `<h1 class="mrspb-dynamic" data-dyn="post_title" style="font-size: 36px; margin-bottom: 10px;">Post Title</h1>` },
		{ id: 'post-excerpt', label: 'Post Excerpt', category: 'Dynamic', content: `<p class="mrspb-dynamic" data-dyn="post_excerpt" style="color: #475569;">Post excerpt will be displayed here.</p>` },
		{ id: 'featured-image', label: 'Featured Image', category: 'Dynamic', content: `<img class="mrspb-dynamic" data-dyn="featured_image" src="${mrspbData.pluginUrl}assets/img/placeholder.png" alt="Featured Image" style="max-width: 100%; border-radius: 12px;">` },

		// WordPress
		{ id: 'shortcode', label: 'Shortcode', category: 'WordPress', content: { tagName: 'div', classes: ['mrspb-shortcode'], content: '[your_shortcode]', style: { padding: '10px', background: '#f1f5f9', 'border-left': '3px solid #2563eb' } } }
	];

	const editor = window.mrspbEditor = grapesjs.init({
		container: '#gjs',
		height: '100%',
		width: 'auto',
		storageManager: false,
		assetManager: {
			upload: false,
			embedAsBase64: false,
		},
		canvas: {
			styles: [
				mrspbData.pluginUrl + 'assets/vendor/aos/aos.css',
				mrspbData.pluginUrl + 'assets/vendor/swiper/swiper-bundle.min.css'
			],
			scripts: [
				mrspbData.pluginUrl + 'assets/vendor/aos/aos.js',
				mrspbData.pluginUrl + 'assets/vendor/swiper/swiper-bundle.min.js',
				mrspbData.pluginUrl + 'assets/vendor/lottie/lottie.min.js'
			]
		},
		blockManager: {
			blocks: blocks
		},
		deviceManager: {
			devices: [
				{ name: 'Desktop', width: '' },
				{ name: 'Tablet', width: '768px', widthMedia: '768px' },
				{ name: 'Mobile', width: '380px', widthMedia: '380px' }
			]
		}
	});

	editor.on('load', () => {
		if ( initial.html ) {
			editor.setComponents(initial.html);
		}
		if ( initial.css ) {
			editor.setStyle(initial.css);
		}
	});

	editor.setComponentsAndStyle = function(html, css) {
		if ( html ) this.setComponents(html);
		if ( css ) this.setStyle(css);
	};

	// WordPress media modal command
	editor.Commands.add('open-wp-media', {
		run(ed) {
			const component = ed.getSelected();
			if ( typeof wp === 'undefined' || ! wp.media ) {
				alert('WordPress media library not loaded.');
				return;
			}
			const frame = wp.media({
				title: 'Select or Upload Image',
				button: { text: 'Use this image' },
				multiple: false,
				library: { type: 'image' }
			});
			frame.on('select', () => {
				const attachment = frame.state().get('selection').first().toJSON();
				if ( component && component.get('type') === 'image' ) {
					component.set('src', attachment.url);
					component.set('alt', attachment.alt || '');
				}
			});
			frame.open();
		}
	});

	function getTraitDefinition() {
		return [
			{ type: 'text', name: 'id', label: 'ID' },
			{ type: 'text', name: 'class', label: 'Classes' },
			{ type: 'select', name: 'data-aos', label: 'AOS Animation', options: animOptions, changeProp: 1 },
			{ type: 'number', name: 'data-aos-delay', label: 'AOS Delay (ms)', placeholder: '0' },
			{ type: 'select', name: 'data-gsap', label: 'GSAP Animation', options: gsapOptions, changeProp: 1 },
			{ type: 'number', name: 'data-gsap-delay', label: 'GSAP Delay (ms)', placeholder: '0' },
			{ type: 'select', name: 'data-visibility', label: 'Visibility', options: visibilityOptions, changeProp: 1 }
		];
	}

	editor.DomComponents.addType('default', {
		model: {
			defaults: {
				traits: getTraitDefinition()
			}
		}
	});

	editor.DomComponents.addType('image', {
		model: {
			defaults: {
				traits: [
					{ type: 'text', name: 'src', label: 'Source' },
					{ type: 'text', name: 'alt', label: 'Alt' },
					{ type: 'text', name: 'title', label: 'Title' },
					{ type: 'text', name: 'id', label: 'ID' },
					{ type: 'text', name: 'class', label: 'Classes' },
					{ type: 'button', name: 'wp-media', text: 'Select from WordPress Media', command: 'open-wp-media', full: 1 },
					{ type: 'select', name: 'data-aos', label: 'AOS Animation', options: animOptions, changeProp: 1 },
					{ type: 'number', name: 'data-aos-delay', label: 'AOS Delay (ms)', placeholder: '0' },
					{ type: 'select', name: 'data-gsap', label: 'GSAP Animation', options: gsapOptions, changeProp: 1 },
					{ type: 'number', name: 'data-gsap-delay', label: 'GSAP Delay (ms)', placeholder: '0' },
					{ type: 'select', name: 'data-visibility', label: 'Visibility', options: visibilityOptions, changeProp: 1 }
				]
			}
		}
	});

	// Listen for visibility trait changes to add/remove classes
	editor.on('component:update', (model) => {
		const v = model.get('attributes')['data-visibility'];
		if ( v ) {
			const cls = model.getClasses();
			['mrspb-hide-desktop','mrspb-hide-tablet','mrspb-hide-mobile'].forEach(c => {
				if ( cls.indexOf(c) > -1 ) model.removeClass(c);
			});
			if ( ['mrspb-hide-desktop','mrspb-hide-tablet','mrspb-hide-mobile'].indexOf(v) > -1 ) {
				model.addClass(v);
			}
		}
	});

	// Template loader
	const tplSelect = document.getElementById('mrspb-template');
	if ( tplSelect ) {
		tplSelect.addEventListener('change', (e) => {
			const slug = e.target.value;
			if ( ! slug ) return;
			if ( ! confirm('Replace current canvas with template?') ) { e.target.value = ''; return; }
			fetch(mrspbData.ajaxUrl + '?action=mrspb_get_template&slug=' + encodeURIComponent(slug) + '&nonce=' + encodeURIComponent(mrspbData.nonce), {
				method: 'GET'
			})
			.then(r => r.json())
			.then(data => {
				if ( data.success ) {
					editor.setComponentsAndStyle(data.data.html || '', data.data.css || '');
				}
				else { alert('Template load failed.'); }
				e.target.value = '';
			})
			.catch(() => { alert('Template load failed.'); e.target.value = ''; });
		});
	}

	// Top toolbar buttons
	document.getElementById('mrspb-undo')?.addEventListener('click', () => editor.UndoManager.undo());
	document.getElementById('mrspb-redo')?.addEventListener('click', () => editor.UndoManager.redo());
	document.getElementById('mrspb-code')?.addEventListener('click', () => {
		let html = editor.getHtml();
		let css = editor.getCss();
		const win = window.open('', '_blank', 'width=800,height=600');
		win.document.write('<textarea style="width:100%;height:90%;">' + html + '\n<style>' + css + '</style></textarea>');
	});
	document.getElementById('mrspb-fullscreen')?.addEventListener('click', () => {
		if ( ! document.fullscreenElement ) {
			document.documentElement.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	});

	document.querySelector('.mrspb-save').addEventListener('click', () => {
		const btn = document.querySelector('.mrspb-save');
		btn.textContent = 'Saving...';
		const html = editor.getHtml();
		const css = editor.getCss();
		fetch(mrspbData.ajaxUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ action: 'mrspb_save', post_id: postId, html, css, nonce: mrspbData.nonce })
		})
		.then(r => r.json())
		.then(data => {
			btn.textContent = data.success ? 'Saved' : 'Error';
			setTimeout(() => btn.textContent = 'Save', 1500);
		})
		.catch(() => {
			btn.textContent = 'Error';
			setTimeout(() => btn.textContent = 'Save', 1500);
		});
	});

	window.addEventListener('beforeunload', e => {
		if ( editor.getDirtyCount() > 1 ) {
			e.preventDefault();
			e.returnValue = '';
		}
	});
})();
