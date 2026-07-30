(function () {
	'use strict';

	const app = document.getElementById('mrspb-builder');
	if ( ! app ) return;

	const postId = app.dataset.postId;
	const initial = JSON.parse(document.getElementById('mrspb-initial').textContent || '{}');

	const animOptions = [
		{ value: '', name: 'None' },
		{ value: 'fade', name: 'Fade' },
		{ value: 'fade-up', name: 'Fade Up' },
		{ value: 'fade-down', name: 'Fade Down' },
		{ value: 'fade-left', name: 'Fade Left' },
		{ value: 'fade-right', name: 'Fade Right' },
		{ value: 'zoom-in', name: 'Zoom In' },
		{ value: 'zoom-out', name: 'Zoom Out' },
		{ value: 'flip-up', name: 'Flip Up' },
		{ value: 'flip-left', name: 'Flip Left' }
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
				mrspbData.pluginUrl + 'assets/vendor/swiper/swiper-bundle.min.js'
			]
		},
		blockManager: {
			blocks: [
				{ id: 'section', label: 'Section', category: 'Layout', content: { tagName: 'section', classes: ['mrspb-section'], style: { padding: '60px 20px', 'background-color': '#f8fafc' } } },
				{ id: 'container', label: 'Container', category: 'Layout', content: { tagName: 'div', classes: ['mrspb-container'], style: { 'max-width': '1200px', margin: '0 auto', padding: '20px' } } },
				{ id: 'row-2', label: '2 Columns', category: 'Layout', content: `<div class="mrspb-row" style="display: flex; gap: 20px;"><div class="mrspb-col" style="flex: 1;"></div><div class="mrspb-col" style="flex: 1;"></div></div>` },
				{ id: 'row-3', label: '3 Columns', category: 'Layout', content: `<div class="mrspb-row" style="display: flex; gap: 20px;"><div class="mrspb-col" style="flex: 1;"></div><div class="mrspb-col" style="flex: 1;"></div><div class="mrspb-col" style="flex: 1;"></div></div>` },
				{ id: 'heading', label: 'Heading', category: 'Basic', content: { type: 'text', tagName: 'h2', content: 'Heading', style: { padding: '10px', 'font-size': '32px', color: '#0f172a' } } },
				{ id: 'text', label: 'Text', category: 'Basic', content: { type: 'text', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', style: { padding: '10px', color: '#334155' } } },
				{ id: 'image', label: 'Image', category: 'Basic', content: { type: 'image', style: { padding: '10px' } } },
				{ id: 'button', label: 'Button', category: 'Basic', content: { type: 'link', content: 'Click me', style: { display: 'inline-block', padding: '12px 24px', 'background-color': '#2563eb', color: '#fff', 'border-radius': '6px', 'text-decoration': 'none', 'font-weight': '600' } } },
				{ id: 'spacer', label: 'Spacer', category: 'Basic', content: { tagName: 'div', classes: ['mrspb-spacer'], style: { height: '60px' } } },
				{ id: 'divider', label: 'Divider', category: 'Basic', content: { tagName: 'hr', classes: ['mrspb-divider'], style: { border: 'none', 'border-top': '1px solid #cbd5e1', margin: '20px 0' } } },
				{ id: 'video', label: 'Video', category: 'Media', content: `<div class="mrspb-video" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #0f172a;"><iframe src="" style="position: absolute; inset: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe></div>` },
				{ id: 'map', label: 'Map', category: 'Media', content: `<div class="mrspb-map" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://maps.google.com/maps?q=&output=embed" style="position: absolute; inset: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe></div>` },
				{ id: 'carousel', label: 'Carousel', category: 'Media', content: `<div class="swiper mrspb-swiper" style="width:100%;"><div class="swiper-wrapper"><div class="swiper-slide" style="display:flex;align-items:center;justify-content:center;min-height:200px;background:#e2e8f0;">Slide 1</div><div class="swiper-slide" style="display:flex;align-items:center;justify-content:center;min-height:200px;background:#cbd5e1;">Slide 2</div><div class="swiper-slide" style="display:flex;align-items:center;justify-content:center;min-height:200px;background:#94a3b8;">Slide 3</div></div><div class="swiper-pagination"></div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div></div>` },
				{ id: 'shortcode', label: 'Shortcode', category: 'WordPress', content: { tagName: 'div', classes: ['mrspb-shortcode'], content: '[your_shortcode]', style: { padding: '10px', background: '#f1f5f9' } } }
			]
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

	// WordPress media modal command
	editor.Commands.add('open-wp-media', {
		run(ed, sender, options) {
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

	// Add animation trait to all components
	editor.DomComponents.addType('default', {
		model: {
			defaults: {
				traits: [
					{
						type: 'select',
						name: 'data-aos',
						label: 'Animation',
						options: animOptions,
						changeProp: 1
					},
					{
						type: 'number',
						name: 'data-aos-delay',
						label: 'Anim Delay (ms)',
						placeholder: '0'
					}
				]
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
					{
						type: 'button',
						name: 'wp-media',
						text: 'Select from WordPress Media',
						command: 'open-wp-media',
						full: 1
					},
					{ type: 'select', name: 'data-aos', label: 'Animation', options: animOptions, changeProp: 1 },
					{ type: 'number', name: 'data-aos-delay', label: 'Anim Delay (ms)', placeholder: '0' }
				]
			}
		}
	});

	// Initialize AOS in builder preview after a short delay
	editor.on('canvas:drag', () => {
		if ( typeof AOS !== 'undefined' ) AOS.refresh();
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
