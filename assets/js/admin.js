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
		{ id: 'row-2', label: '2 Columns Grid', category: 'Layout', content: { tagName: 'div', classes: ['mrspb-grid'], attributes: { 'data-columns': '2', 'data-gap': '24' }, components: [{ tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }, { tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }] } },
		{ id: 'row-3', label: '3 Columns Grid', category: 'Layout', content: { tagName: 'div', classes: ['mrspb-grid'], attributes: { 'data-columns': '3', 'data-gap': '24' }, components: [{ tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }, { tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }, { tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }] } },
		{ id: 'row-4', label: '4 Columns Grid', category: 'Layout', content: { tagName: 'div', classes: ['mrspb-grid'], attributes: { 'data-columns': '4', 'data-gap': '24' }, components: [{ tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }, { tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }, { tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }, { tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px' } }] } },
		{ id: 'flex-row', label: 'Flex Row', category: 'Layout', content: { tagName: 'div', classes: ['mrspb-flex'], attributes: { 'data-align': 'center', 'data-justify': 'between', 'data-gap': '24' }, components: [{ tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px', flex: '1' } }, { tagName: 'div', style: { 'min-height': '80px', background: '#fff', border: '1px dashed #cbd5e1', 'border-radius': '8px', flex: '1' } }] } },

		// Sections
		{ id: 'hero', label: 'Hero', category: 'Sections', content: { tagName: 'section', classes: ['mrspb-hero'], attributes: { 'data-gsap': 'fade' }, style: { padding: '100px 20px', background: 'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)', color: '#fff', 'text-align': 'center' }, components: [{ tagName: 'div', classes: ['mrspb-container'], style: { 'max-width': '800px', margin: '0 auto' }, components: [{ type: 'text', tagName: 'h1', content: 'Build Something Amazing', attributes: { 'data-gsap': 'slide-up' }, style: { 'font-size': '48px', 'margin-bottom': '20px', color: '#fff' } }, { type: 'text', tagName: 'p', content: 'Drag, drop and style every element with Page Builder Pro.', attributes: { 'data-gsap': 'slide-up' }, style: { 'font-size': '18px', 'line-height': '1.6', 'margin-bottom': '30px', opacity: '0.9', color: '#fff' } }, { type: 'link', content: 'Get Started', attributes: { 'data-gsap': 'zoom-in' }, style: { display: 'inline-block', padding: '14px 32px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none', 'font-weight': '600' } }] }] } },
		{ id: 'cta', label: 'Call to Action', category: 'Sections', content: { tagName: 'section', classes: ['mrspb-cta'], attributes: { 'data-gsap': 'fade' }, style: { padding: '80px 20px', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: '#fff', 'text-align': 'center' }, components: [{ tagName: 'div', style: { 'max-width': '800px', margin: '0 auto' }, components: [{ type: 'text', tagName: 'h2', content: 'Ready to start?', attributes: { 'data-gsap': 'slide-up' }, style: { 'font-size': '36px', 'margin-bottom': '15px' } }, { type: 'text', tagName: 'p', content: 'Join thousands of happy customers.', attributes: { 'data-gsap': 'slide-up' }, style: { 'font-size': '18px', opacity: '0.9', 'margin-bottom': '30px' } }, { type: 'link', content: 'Get Started', attributes: { 'data-gsap': 'zoom-in' }, style: { display: 'inline-block', padding: '14px 32px', background: '#fff', color: '#2563eb', 'border-radius': '6px', 'text-decoration': 'none', 'font-weight': '600' } }] }] } },
		{ id: 'feature-box', label: 'Feature Box', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-feature-box'], style: { padding: '30px', 'background-color': '#fff', 'border-radius': '12px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)', 'text-align': 'center' }, components: [{ tagName: 'div', content: '⭐', style: { 'font-size': '40px', 'margin-bottom': '15px' } }, { type: 'text', tagName: 'h3', content: 'Feature Title', style: { 'font-size': '22px', 'margin-bottom': '10px' } }, { type: 'text', tagName: 'p', content: 'Describe the value of this feature in a few lines.', style: { color: '#475569' } }] } },
		{ id: 'pricing-table', label: 'Pricing Table', category: 'Sections', content: { tagName: 'section', style: { padding: '60px 20px', 'background-color': '#f8fafc' }, components: [{ tagName: 'div', style: { 'max-width': '1200px', margin: '0 auto', 'text-align': 'center' }, components: [{ type: 'text', tagName: 'h2', content: 'Pricing Plans', style: { 'font-size': '36px', 'margin-bottom': '40px' } }, { tagName: 'div', style: { display: 'grid', 'grid-template-columns': 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }, components: [{ tagName: 'div', style: { width: '100%', 'background-color': '#fff', 'border-radius': '12px', padding: '30px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)' }, components: [{ type: 'text', tagName: 'h3', content: 'Basic' }, { type: 'text', tagName: 'p', content: '$9/mo', style: { 'font-size': '24px', 'font-weight': '700' } }, { type: 'text', tagName: 'p', content: 'Essential features.' }, { type: 'link', content: 'Choose', style: { display: 'inline-block', padding: '10px 20px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none' } }] }, { tagName: 'div', style: { width: '100%', 'background-color': '#fff', 'border-radius': '12px', padding: '30px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)', border: '2px solid #2563eb' }, components: [{ type: 'text', tagName: 'h3', content: 'Pro' }, { type: 'text', tagName: 'p', content: '$29/mo', style: { 'font-size': '24px', 'font-weight': '700' } }, { type: 'text', tagName: 'p', content: 'Advanced tools.' }, { type: 'link', content: 'Choose', style: { display: 'inline-block', padding: '10px 20px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none' } }] }, { tagName: 'div', style: { width: '100%', 'background-color': '#fff', 'border-radius': '12px', padding: '30px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)' }, components: [{ type: 'text', tagName: 'h3', content: 'Agency' }, { type: 'text', tagName: 'p', content: '$79/mo', style: { 'font-size': '24px', 'font-weight': '700' } }, { type: 'text', tagName: 'p', content: 'Full power.' }, { type: 'link', content: 'Choose', style: { display: 'inline-block', padding: '10px 20px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none' } }] }] }] }] } },
		{ id: 'testimonial', label: 'Testimonial', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-testimonial'], style: { padding: '40px', 'background-color': '#fff', 'border-radius': '12px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)', 'text-align': 'center' }, components: [{ type: 'text', tagName: 'p', content: '"This page builder completely changed how we launch landing pages."', style: { 'font-size': '20px', 'font-style': 'italic', color: '#334155', 'margin-bottom': '20px' } }, { type: 'text', tagName: 'h4', content: 'Jane Doe', style: { 'font-size': '18px', 'font-weight': '600' } }, { type: 'text', tagName: 'p', content: 'CEO, Example Inc.', style: { color: '#64748b' } }] } },
		{ id: 'counter', label: 'Counter', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-counter'], attributes: { 'data-target': '1000', 'data-suffix': '+' }, style: { padding: '40px', 'background-color': '#f1f5f9', 'border-radius': '12px', 'text-align': 'center' }, components: [{ type: 'text', tagName: 'div', classes: ['mrspb-counter'], attributes: { 'data-target': '1000', 'data-suffix': '+' }, content: '1000+', style: { 'font-size': '48px', 'font-weight': '700', color: '#2563eb' } }, { type: 'text', tagName: 'p', content: 'Happy Customers', style: { color: '#475569' } }] } },
		{ id: 'progress-bar', label: 'Progress Bar', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-progress'], style: { padding: '20px' }, components: [{ type: 'text', tagName: 'p', content: 'Skill Level', style: { 'margin-bottom': '8px' } }, { tagName: 'div', style: { width: '100%', height: '20px', 'background-color': '#e2e8f0', 'border-radius': '10px', overflow: 'hidden' }, components: [{ tagName: 'div', style: { width: '75%', height: '100%', 'background-color': '#2563eb' } }] }] } },
		{ id: 'team-member', label: 'Team Member', category: 'Sections', content: { tagName: 'div', classes: ['mrspb-team'], style: { padding: '24px', 'background-color': '#fff', 'border-radius': '12px', 'box-shadow': '0 4px 12px rgba(0,0,0,.05)', 'text-align': 'center' }, components: [{ type: 'image', classes: ['mrspb-team-avatar'], style: { width: '120px', height: '120px', 'border-radius': '50%', 'object-fit': 'cover', 'margin-bottom': '15px' } }, { type: 'text', tagName: 'h4', content: 'Team Member', style: { 'font-size': '20px', 'margin-bottom': '5px' } }, { type: 'text', tagName: 'p', content: 'Role / Position', style: { color: '#64748b' } }] } },
		{ id: 'faq', label: 'FAQ Accordion', category: 'Sections', content: `<div class="mrspb-faq" style="max-width: 800px; margin: 0 auto;"><div class="mrspb-faq-item" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px;"><div class="mrspb-faq-question" style="padding: 15px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between;"><span>Question 1?</span><span>+</span></div><div class="mrspb-faq-answer" style="padding: 0 15px; color: #475569;"><p>Answer to question 1.</p></div></div><div class="mrspb-faq-item" style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 10px;"><div class="mrspb-faq-question" style="padding: 15px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between;"><span>Question 2?</span><span>+</span></div><div class="mrspb-faq-answer" style="padding: 0 15px; color: #475569;"><p>Answer to question 2.</p></div></div></div>` },
		{ id: 'newsletter', label: 'Newsletter', category: 'Sections', content: `<form class="mrspb-form" data-form-id="newsletter" style="max-width: 500px; margin: 0 auto; padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,.05); text-align: center;"><h3 style="margin-top: 0;">Subscribe to our newsletter</h3><p style="color: #475569;">Get the latest updates right in your inbox.</p><div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;"><input type="email" name="email" placeholder="Enter your email" required style="flex: 1; min-width: 200px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;"><button type="submit" style="padding: 12px 24px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Subscribe</button></div></form>` },
		{ id: 'cookie-banner', label: 'Cookie Banner', category: 'Sections', content: `<div class="mrspb-cookie-banner" style="position: fixed; bottom: 0; left: 0; right: 0; background: #1e293b; color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; z-index: 9999;"><p style="margin: 0;">We use cookies to improve your experience.</p><button class="mrspb-cookie-accept" style="padding: 8px 16px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer;">Accept</button></div>` },
		{ id: 'stats', label: 'Stats Row', category: 'Sections', content: { tagName: 'section', classes: ['mrspb-section'], style: { padding: '60px 20px', 'background-color': '#f8fafc', 'text-align': 'center' }, components: [{ tagName: 'div', classes: ['mrspb-container'], components: [{ tagName: 'div', classes: ['mrspb-grid'], attributes: { 'data-columns': '4' }, components: [{ tagName: 'div', style: { padding: '20px' }, components: [{ tagName: 'div', classes: ['mrspb-counter'], attributes: { 'data-target': '1000', 'data-suffix': '+' }, content: '1000+', style: { 'font-size': '36px', 'font-weight': '700', color: '#2563eb' } }, { tagName: 'p', content: 'Projects' }] }] }] }] } },
		{ id: 'steps', label: 'Steps', category: 'Sections', content: { tagName: 'section', classes: ['mrspb-section'], style: { padding: '60px 20px', 'background-color': '#fff' }, components: [{ tagName: 'div', classes: ['mrspb-container'], components: [{ type: 'text', tagName: 'h2', content: 'How it works', style: { 'text-align': 'center', 'margin-bottom': '40px' } }, { tagName: 'div', classes: ['mrspb-grid'], attributes: { 'data-columns': '3' }, components: [{ tagName: 'div', classes: ['mrspb-feature-box'], style: { padding: '30px', 'text-align': 'center', 'border-radius': '12px', 'background-color': '#f8fafc' }, components: [{ tagName: 'div', content: '1', style: { width: '40px', height: '40px', 'border-radius': '50%', 'background-color': '#2563eb', color: '#fff', display: 'flex', 'align-items': 'center', 'justify-content': 'center', margin: '0 auto 15px', 'font-weight': '700' } }, { tagName: 'h4', content: 'Step 1' }, { tagName: 'p', content: 'Describe the first step.', style: { color: '#475569' } }] }] }] }] } },
		{ id: 'clients', label: 'Client Logos', category: 'Sections', content: { tagName: 'section', classes: ['mrspb-section'], style: { padding: '60px 20px', 'background-color': '#f8fafc' }, components: [{ tagName: 'div', classes: ['mrspb-container'], components: [{ type: 'text', tagName: 'h3', content: 'Trusted by', style: { 'text-align': 'center', 'margin-bottom': '30px', opacity: '.7' } }, { tagName: 'div', classes: ['mrspb-flex'], attributes: { 'data-justify': 'center', 'data-gap': '40', 'data-fit': 'true' }, components: [{ tagName: 'div', content: 'Client 1', style: { padding: '10px 20px', 'background-color': '#fff', 'border-radius': '6px', 'box-shadow': '0 2px 8px rgba(0,0,0,.05)', 'font-weight': '600', color: '#64748b' } }, { tagName: 'div', content: 'Client 2', style: { padding: '10px 20px', 'background-color': '#fff', 'border-radius': '6px', 'box-shadow': '0 2px 8px rgba(0,0,0,.05)', 'font-weight': '600', color: '#64748b' } }, { tagName: 'div', content: 'Client 3', style: { padding: '10px 20px', 'background-color': '#fff', 'border-radius': '6px', 'box-shadow': '0 2px 8px rgba(0,0,0,.05)', 'font-weight': '600', color: '#64748b' } }, { tagName: 'div', content: 'Client 4', style: { padding: '10px 20px', 'background-color': '#fff', 'border-radius': '6px', 'box-shadow': '0 2px 8px rgba(0,0,0,.05)', 'font-weight': '600', color: '#64748b' } }] }] }] } },
		{ id: 'blog', label: 'Blog Preview', category: 'Sections', content: { tagName: 'section', classes: ['mrspb-section'], style: { padding: '60px 20px', 'background-color': '#fff' }, components: [{ tagName: 'div', classes: ['mrspb-container'], components: [{ type: 'text', tagName: 'h2', content: 'Latest Articles', style: { 'text-align': 'center', 'margin-bottom': '40px' } }, { tagName: 'div', classes: ['mrspb-post-grid-placeholder'], style: { padding: '30px', 'background-color': '#f1f5f9', 'border-radius': '12px', 'text-align': 'center' }, components: [{ type: 'text', tagName: 'p', content: '[mrspb_posts post_type="post" count="3" columns="3"]', style: { 'font-family': 'monospace', color: '#2563eb' } }] }] }] } },
		{ id: 'footer', label: 'Footer', category: 'Sections', content: { tagName: 'footer', classes: ['mrspb-section'], style: { padding: '60px 20px', 'background-color': '#0f172a', color: '#fff' }, components: [{ tagName: 'div', classes: ['mrspb-container'], components: [{ tagName: 'div', classes: ['mrspb-grid'], attributes: { 'data-columns': '4' }, components: [{ tagName: 'div', components: [{ tagName: 'h4', content: 'Brand', style: { 'margin-bottom': '15px' } }, { tagName: 'p', content: 'Build faster with Page Builder Pro.', style: { color: '#94a3b8', 'font-size': '14px' } }] }, { tagName: 'div', components: [{ tagName: 'h4', content: 'Pages', style: { 'margin-bottom': '15px' } }, { tagName: 'p', content: 'Home \n About \n Contact', style: { color: '#94a3b8', 'font-size': '14px', 'white-space': 'pre-line' } }] }, { tagName: 'div', components: [{ tagName: 'h4', content: 'Social', style: { 'margin-bottom': '15px' } }, { tagName: 'p', content: 'Twitter \n Instagram \n LinkedIn', style: { color: '#94a3b8', 'font-size': '14px', 'white-space': 'pre-line' } }] }, { tagName: 'div', components: [{ tagName: 'h4', content: 'Newsletter', style: { 'margin-bottom': '15px' } }, { tagName: 'p', content: 'Subscribe for updates.', style: { color: '#94a3b8', 'font-size': '14px' } }] }] }] }] } },

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
		{ id: 'tabs', label: 'Tabs', category: 'Interactive', content: `<div class="mrspb-tabs" style="max-width: 800px; margin: 0 auto;"><div style="display: flex; gap: 10px; border-bottom: 2px solid #e2e8f0; margin-bottom: 20px;"><button data-tab="tab1" style="padding: 10px 20px; background: #2563eb; color: #fff; border: none; border-radius: 6px 6px 0 0;">Tab 1</button><button data-tab="tab2" style="padding: 10px 20px; background: #f1f5f9; color: #475569; border: none; border-radius: 6px 6px 0 0;">Tab 2</button></div><div data-tab-panel="tab1" style="padding: 20px; background: #fff; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,.05);"><h3>Tab 1</h3><p>First tab panel content.</p></div><div data-tab-panel="tab2" style="padding: 20px; background: #fff; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,.05); display: none;"><h3>Tab 2</h3><p>Second tab panel content.</p></div></div>` },
		{ id: 'accordion', label: 'Accordion', category: 'Interactive', content: `<div class="mrspb-accordion" style="max-width: 800px; margin: 0 auto;"><div class="mrspb-accordion-item" style="margin-bottom: 10px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;"><div class="mrspb-accordion-header" style="padding: 15px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between;"><span>Accordion Item 1</span><span>+</span></div><div class="mrspb-accordion-content" style="padding: 0 15px 15px; color: #475569;"><p>First accordion content.</p></div></div><div class="mrspb-accordion-item" style="margin-bottom: 10px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;"><div class="mrspb-accordion-header" style="padding: 15px; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between;"><span>Accordion Item 2</span><span>+</span></div><div class="mrspb-accordion-content" style="padding: 0 15px 15px; color: #475569;"><p>Second accordion content.</p></div></div></div>` },
		{ id: 'countdown', label: 'Countdown', category: 'Interactive', content: `<div class="mrspb-countdown" data-target-date="2026-12-31T23:59:59" style="display: flex; gap: 20px; justify-content: center; padding: 40px 20px; background: #f8fafc; border-radius: 12px;"><div style="text-align: center;"><div data-countdown-part="days" style="font-size: 48px; font-weight: 700; color: #2563eb;">00</div><div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Days</div></div><div style="text-align: center;"><div data-countdown-part="hours" style="font-size: 48px; font-weight: 700; color: #2563eb;">00</div><div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Hours</div></div><div style="text-align: center;"><div data-countdown-part="minutes" style="font-size: 48px; font-weight: 700; color: #2563eb;">00</div><div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Minutes</div></div><div style="text-align: center;"><div data-countdown-part="seconds" style="font-size: 48px; font-weight: 700; color: #2563eb;">00</div><div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Seconds</div></div></div>` },
		{ id: 'form', label: 'Contact Form', category: 'Interactive', content: `<form class="mrspb-form" data-form-id="contact" style="max-width: 600px; margin: 0 auto; padding: 30px; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,.05);"><h3 style="margin-top: 0;">Contact Us</h3><div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: 600;">Name</label><input type="text" name="name" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;"></div><div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: 600;">Email</label><input type="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;"></div><div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px; font-weight: 600;">Message</label><textarea name="message" rows="4" required style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;"></textarea></div><button type="submit" style="padding: 12px 24px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Send Message</button></form>` },
		{ id: 'search', label: 'Search Form', category: 'Interactive', content: `<form class="mrspb-search-form" method="get" action="/" style="display: flex; gap: 10px; max-width: 500px; margin: 0 auto;"><input type="text" name="s" placeholder="Search..." style="flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;"><button type="submit" style="padding: 12px 24px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">Search</button></form>` },
		{ id: 'star-rating', label: 'Star Rating', category: 'Interactive', content: `<div class="mrspb-star-rating" data-rating="4.5" style="font-size: 24px; color: #fbbf24; letter-spacing: 2px;">★★★★★</div>` },

		// Dynamic
		{ id: 'post-title', label: 'Post Title', category: 'Dynamic', content: `<h1 class="mrspb-dynamic" data-dyn="post_title" style="font-size: 36px; margin-bottom: 10px;">Post Title</h1>` },
		{ id: 'post-excerpt', label: 'Post Excerpt', category: 'Dynamic', content: `<p class="mrspb-dynamic" data-dyn="post_excerpt" style="color: #475569;">Post excerpt will be displayed here.</p>` },
		{ id: 'featured-image', label: 'Featured Image', category: 'Dynamic', content: `<img class="mrspb-dynamic" data-dyn="featured_image" src="${mrspbData.pluginUrl}assets/img/placeholder.png" alt="Featured Image" style="max-width: 100%; border-radius: 12px;">` },

		// WordPress
		{ id: 'shortcode', label: 'Shortcode', category: 'WordPress', content: { tagName: 'div', classes: ['mrspb-shortcode'], content: '[your_shortcode]', style: { padding: '10px', background: '#f1f5f9', 'border-left': '3px solid #2563eb' } } },

		// Advanced
		{ id: 'popup', label: 'Popup / Modal', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-modal'], attributes: { id: 'modal1' }, style: { display: 'none', position: 'fixed', inset: '0', 'z-index': '10000', 'background-color': 'rgba(0,0,0,.5)', 'align-items': 'center', 'justify-content': 'center' }, components: [{ tagName: 'div', classes: ['mrspb-modal-content'], style: { background: '#fff', padding: '30px', 'border-radius': '12px', 'max-width': '600px', width: '90%', position: 'relative' }, components: [{ tagName: 'button', content: '×', classes: ['mrspb-modal-close'], attributes: { 'data-mrspb-close': 'modal1' }, style: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', 'font-size': '24px', cursor: 'pointer' } }, { type: 'text', tagName: 'h2', content: 'Popup Title', style: { 'margin-top': '0' } }, { type: 'text', tagName: 'p', content: 'This is a modal popup. Add a button with data-mrspb-open="modal1" to open it.', style: { color: '#475569' } }] }] } },
		{ id: 'video-bg', label: 'Video Background', category: 'Advanced', content: { tagName: 'section', classes: ['mrspb-section'], style: { position: 'relative', padding: '120px 20px', 'text-align': 'center', color: '#fff', overflow: 'hidden' }, components: [{ tagName: 'video', classes: ['mrspb-video-bg'], attributes: { autoplay: 'autoplay', muted: 'muted', loop: 'loop', playsinline: 'playsinline' }, style: { position: 'absolute', inset: '0', width: '100%', height: '100%', 'object-fit': 'cover', 'z-index': '-1' }, components: [{ tagName: 'source', attributes: { src: '', type: 'video/mp4' } }] }, { tagName: 'div', style: { position: 'relative', 'max-width': '800px', margin: '0 auto', 'z-index': '1' }, components: [{ type: 'text', tagName: 'h1', content: 'Cinematic Hero', style: { 'font-size': '48px' } }] }] } },
		{ id: 'before-after', label: 'Before / After Slider', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-before-after'], style: { position: 'relative', width: '100%', 'max-width': '600px', height: '300px', overflow: 'hidden', margin: '0 auto' }, components: [{ type: 'image', classes: ['mrspb-before'], style: { position: 'absolute', inset: '0', width: '100%', height: '100%', 'object-fit': 'cover' } }, { tagName: 'div', classes: ['mrspb-after-wrap'], style: { position: 'absolute', inset: '0', width: '50%', overflow: 'hidden' }, components: [{ type: 'image', classes: ['mrspb-after'], style: { position: 'absolute', inset: '0', width: '100%', height: '100%', 'object-fit': 'cover' } }] }, { tagName: 'input', classes: ['mrspb-slider'], attributes: { type: 'range', min: '0', max: '100', value: '50' }, style: { position: 'absolute', inset: '0', width: '100%', height: '100%', opacity: '0', cursor: 'ew-resize', 'z-index': '3' } }, { tagName: 'div', classes: ['mrspb-handle'], style: { position: 'absolute', top: '0', bottom: '0', left: '50%', width: '4px', background: '#fff', transform: 'translateX(-50%)', 'z-index': '2' } }] } },
		{ id: 'typewriter', label: 'Typewriter Text', category: 'Advanced', content: { type: 'text', tagName: 'span', classes: ['mrspb-typewriter'], attributes: { 'data-typewriter': '["Hello","World"]', 'data-typewriter-speed': '120', 'data-typewriter-pause': '2000' }, content: 'Typewriter', style: { 'font-size': '36px', color: '#2563eb' } } },
		{ id: 'particles', label: 'Particle Background', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-particles'], attributes: { 'data-color': '#2563eb', 'data-count': '60' }, style: { position: 'absolute', inset: '0', 'pointer-events': 'none', 'z-index': '0' } } },
		{ id: 'masonry-gallery', label: 'Masonry Gallery', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-masonry'], style: { columns: '3 250px', 'column-gap': '16px' }, components: [{ type: 'image', style: { width: '100%', 'border-radius': '8px', 'margin-bottom': '16px' } }, { type: 'image', style: { width: '100%', 'border-radius': '8px', 'margin-bottom': '16px' } }, { type: 'image', style: { width: '100%', 'border-radius': '8px', 'margin-bottom': '16px' } }] } },
		{ id: 'timeline', label: 'Timeline', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-timeline'], style: { position: 'relative', 'padding-left': '30px' }, components: [{ tagName: 'div', classes: ['mrspb-timeline-item'], components: [{ type: 'text', tagName: 'h4', content: '2026 - Milestone', style: { 'margin-bottom': '5px' } }, { type: 'text', tagName: 'p', content: 'Describe this milestone.', style: { color: '#475569' } }] }, { tagName: 'div', classes: ['mrspb-timeline-item'], components: [{ type: 'text', tagName: 'h4', content: '2027 - Milestone' }, { type: 'text', tagName: 'p', content: 'Describe this milestone.', style: { color: '#475569' } }] }] } },
		{ id: 'pie-chart', label: 'Pie Chart', category: 'Advanced', content: { tagName: 'svg', classes: ['mrspb-pie-chart'], attributes: { viewBox: '0 0 36 36' }, components: [{ tagName: 'circle', classes: ['mrspb-pie-bg'], attributes: { cx: '18', cy: '18', r: '15.9' }, style: { fill: 'none', stroke: '#e2e8f0', 'stroke-width': '3' } }, { tagName: 'circle', classes: ['mrspb-pie'], attributes: { cx: '18', cy: '18', r: '15.9', 'data-value': '75', 'data-max': '100' }, style: { fill: 'none', stroke: '#2563eb', 'stroke-width': '3', 'stroke-dasharray': '100 100', 'stroke-dashoffset': '25' } }] } },
		{ id: 'pricing-toggle', label: 'Pricing Toggle', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-pricing-toggle-wrap'], style: { 'text-align': 'center', margin: '20px 0' }, components: [{ tagName: 'label', style: { display: 'inline-flex', 'align-items': 'center', gap: '10px', cursor: 'pointer', 'font-weight': '600' }, components: [{ tagName: 'span', content: 'Monthly' }, { tagName: 'input', classes: ['mrspb-pricing-toggle'], attributes: { type: 'checkbox' }, style: { width: '40px', height: '20px', appearance: 'none', background: '#2563eb', 'border-radius': '20px', position: 'relative', cursor: 'pointer' } }, { tagName: 'span', content: 'Yearly' }] }] } },
		{ id: 'post-grid', label: 'Post Grid (Dynamic)', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-post-grid-placeholder'], style: { padding: '30px', background: '#f1f5f9', 'border-radius': '12px', 'text-align': 'center' }, components: [{ type: 'text', tagName: 'p', content: '[mrspb_posts post_type="post" count="6" columns="3"]', style: { 'font-family': 'monospace', color: '#2563eb' } }] } },
		{ id: 'floating-bar', label: 'Floating Bar', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-floating-bar'], attributes: { 'data-position': 'bottom' }, style: { position: 'fixed', left: '0', right: '0', bottom: '0', 'z-index': '9998', padding: '12px 20px', background: '#fff', 'box-shadow': '0 -4px 12px rgba(0,0,0,.08)', display: 'flex', 'justify-content': 'space-between', 'align-items': 'center' }, components: [{ type: 'text', tagName: 'p', content: 'Limited time offer — act now!', style: { margin: '0', 'font-weight': '600' } }, { type: 'link', content: 'Get Started', style: { padding: '10px 20px', background: '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none' } }] } },
		{ id: 'social-share', label: 'Social Share', category: 'Advanced', content: { tagName: 'div', classes: ['mrspb-social-share'], style: { display: 'flex', gap: '10px', 'flex-wrap': 'wrap' }, components: [{ tagName: 'button', content: 'Facebook', attributes: { 'data-mrspb-share': 'facebook' }, style: { padding: '8px 16px', border: 'none', 'border-radius': '6px', background: '#2563eb', color: '#fff', cursor: 'pointer' } }, { tagName: 'button', content: 'Twitter / X', attributes: { 'data-mrspb-share': 'twitter' }, style: { padding: '8px 16px', border: 'none', 'border-radius': '6px', background: '#334155', color: '#fff', cursor: 'pointer' } }, { tagName: 'button', content: 'Copy Link', attributes: { 'data-mrspb-share': 'copy' }, style: { padding: '8px 16px', border: 'none', 'border-radius': '6px', background: '#64748b', color: '#fff', cursor: 'pointer' } }] } }
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
			blocks: blocks,
			categoryOpt: { open: false }
		},
		deviceManager: {
			devices: [
				{ name: 'Desktop', width: '' },
				{ name: 'Tablet', width: '768px', widthMedia: '768px' },
				{ name: 'Mobile', width: '380px', widthMedia: '380px' }
			]
		},
		styleManager: {
			sectors: [
				{ name: 'Layout', properties: ['display', 'flex-direction', 'justify-content', 'align-items', 'gap', 'padding', 'margin', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'position', 'top', 'right', 'bottom', 'left', 'z-index'] },
				{ name: 'Grid', open: false, properties: ['grid-template-columns', 'grid-template-rows', 'grid-gap', 'justify-items', 'align-items'] },
				{ name: 'Typography', properties: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align', 'letter-spacing', 'text-decoration', 'text-transform'] },
				{ name: 'Decorations', properties: ['background-color', 'background', 'border-radius', 'border', 'box-shadow', 'opacity', 'transition'] },
				{ name: 'Extra', open: false, properties: ['transform', 'cursor', 'overflow', 'white-space', 'object-fit'] }
			]
		},
		colorPicker: {
			palette: [
				'#000000','#111827','#1e293b','#334155','#475569','#64748b','#94a3b8','#cbd5e1','#e2e8f0','#f1f5f9','#f8fafc','#ffffff',
				'#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#22c55e','#10b981','#14b8a6','#06b6d4','#0ea5e9','#3b82f6','#2563eb','#6366f1','#8b5cf6','#a855f7','#d946ef','#ec4899','#f43f5e'
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

	// Theme toggle
	const themeToggle = document.getElementById('mrspb-theme-toggle');
	if ( themeToggle ) {
		themeToggle.addEventListener('click', () => {
			document.body.classList.toggle('mrspb-light');
			themeToggle.textContent = document.body.classList.contains('mrspb-light') ? 'Light' : 'Dark';
		});
	}

	// Modal helpers
	const modalOverlay = document.getElementById('mrspb-modal-overlay');
	const modalBody = document.getElementById('mrspb-modal-body');
	const modalTitle = document.getElementById('mrspb-modal-title');
	const modalSave = document.getElementById('mrspb-modal-save');
	const modalClose = document.getElementById('mrspb-modal-close');
	function openModal(title, body, onSave) {
		modalTitle.textContent = title;
		modalBody.innerHTML = body;
		modalOverlay.style.display = 'flex';
		modalSave.onclick = () => { onSave(); closeModal(); };
	}
	function closeModal() { modalOverlay.style.display = 'none'; modalBody.innerHTML = ''; }
	modalClose?.addEventListener('click', closeModal);
	modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

	// Page settings
	document.getElementById('mrspb-page-settings')?.addEventListener('click', () => {
		const settings = mrspbData.pageSettings || {};
		const form = `
			<label>Page Title Override</label>
			<input type="text" id="mrspb-ps-title" value="${settings.page_title || ''}" placeholder="Leave empty to use default">
			<label>Body Classes</label>
			<input type="text" id="mrspb-ps-class" value="${settings.body_class || ''}" placeholder="e.g. landing-transparent-header">
			<label>Custom CSS</label>
			<textarea id="mrspb-ps-css" placeholder=".mrspb-content .my-class { color: red; }">${settings.custom_css || ''}</textarea>
			<label>Custom JS</label>
			<textarea id="mrspb-ps-js" placeholder="console.log('hello');">${settings.custom_js || ''}</textarea>
		`;
		openModal('Page Settings', form, () => {
			const payload = new URLSearchParams({
				action: 'mrspb_save_page_settings',
				post_id: postId,
				nonce: mrspbData.nonce,
				page_title: document.getElementById('mrspb-ps-title').value,
				body_class: document.getElementById('mrspb-ps-class').value,
				custom_css: document.getElementById('mrspb-ps-css').value,
				custom_js: document.getElementById('mrspb-ps-js').value
			});
			fetch(mrspbData.ajaxUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: payload })
				.then(r => r.json())
				.then(data => { if (data.success) { mrspbData.pageSettings = data.data; alert('Page settings saved.'); } else { alert('Failed to save page settings.'); } })
				.catch(() => alert('Failed to save page settings.'));
		});
	});

	// Global sections
	document.getElementById('mrspb-sections')?.addEventListener('click', () => {
		const selected = editor.getSelected();
		const form = `
			<label>Save current selection as section</label>
			<input type="text" id="mrspb-section-title" placeholder="My Hero Section">
			<div class="mrspb-section-list" id="mrspb-section-list"></div>
		`;
		openModal('Global Sections', form, () => {
			const title = document.getElementById('mrspb-section-title').value;
			const target = editor.getSelected();
			if ( ! title || ! target ) { alert('Enter a title and select an element first.'); return; }
			const payload = new URLSearchParams({
				action: 'mrspb_save_section',
				nonce: mrspbData.nonce,
				title: title,
				html: editor.getHtml({ component: target }),
				css: editor.getCss()
			});
			fetch(mrspbData.ajaxUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: payload })
				.then(r => r.json())
				.then(data => { if (data.success) { refreshSectionList(); document.getElementById('mrspb-section-title').value = ''; } else { alert('Failed to save section.'); } })
				.catch(() => alert('Failed to save section.'));
		});
		function refreshSectionList() {
			fetch(mrspbData.ajaxUrl + '?action=mrspb_get_sections&nonce=' + encodeURIComponent(mrspbData.nonce))
				.then(r => r.json())
				.then(data => {
					const list = document.getElementById('mrspb-section-list');
					if (!list || !data.success) return;
					list.innerHTML = data.data.length ? data.data.map(s => `<div class="mrspb-section-item"><span>${s.title}</span><div><button data-id="${s.id}" data-action="insert">Insert</button> <button data-id="${s.id}" data-action="delete" style="background:#ef4444">Delete</button></div></div>`).join('') : '<p>No global sections yet.</p>';
					list.querySelectorAll('button[data-action="insert"]').forEach(btn => btn.addEventListener('click', () => {
						const sec = data.data.find(x => x.id == btn.dataset.id);
						if (sec) editor.addComponents(sec.html + '<style>' + (sec.css || '') + '</style>');
						closeModal();
					}));
					list.querySelectorAll('button[data-action="delete"]').forEach(btn => btn.addEventListener('click', () => {
						fetch(mrspbData.ajaxUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ action: 'mrspb_delete_section', nonce: mrspbData.nonce, section_id: btn.dataset.id }) })
							.then(() => refreshSectionList());
					}));
				});
		}
		refreshSectionList();
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
