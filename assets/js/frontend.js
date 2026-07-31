(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		// AOS scroll animations
		if (typeof AOS !== 'undefined') {
			AOS.init({ once: true, duration: 800 });
		}

		// Swiper carousels
		if (typeof Swiper !== 'undefined') {
			document.querySelectorAll('.mrspb-swiper').forEach(function (el) {
				new Swiper(el, {
					loop: true,
					pagination: { el: '.swiper-pagination', clickable: true },
					navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
				});
			});
		}

		// GSAP + ScrollTrigger animations
		if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
			gsap.registerPlugin(ScrollTrigger);
			document.querySelectorAll('[data-gsap]').forEach(function (el) {
				var anim = el.getAttribute('data-gsap');
				var y = 0, x = 0, scale = 1, rotation = 0, opacity = 0, dur = 0.8;
				switch (anim) {
					case 'slide-up': y = 60; opacity = 0; break;
					case 'slide-down': y = -60; opacity = 0; break;
					case 'slide-left': x = 60; opacity = 0; break;
					case 'slide-right': x = -60; opacity = 0; break;
					case 'zoom-in': scale = 0.8; opacity = 0; break;
					case 'zoom-out': scale = 1.2; opacity = 0; break;
					case 'flip-left': rotation = -90; opacity = 0; break;
					case 'bounce': y = 60; break;
					case 'fade': opacity = 0; break;
					default: opacity = 0;
				}
				gsap.fromTo(el, { y: y, x: x, scale: scale, rotation: rotation, opacity: opacity }, {
					y: 0, x: 0, scale: 1, rotation: 0, opacity: 1, duration: dur, ease: 'power2.out',
					scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
				});
			});
		}

		// Lottie animations
		if (typeof lottie !== 'undefined') {
			document.querySelectorAll('.mrspb-lottie').forEach(function (el) {
				var url = el.getAttribute('data-url');
				if (url) {
					lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: true, path: url });
				}
			});
		}

		// Contact / newsletter forms (AJAX)
		document.querySelectorAll('.mrspb-form').forEach(function (form) {
			form.addEventListener('submit', function (e) {
				e.preventDefault();
				var btn = form.querySelector('[type="submit"]');
				var original = btn ? btn.textContent : '';
				if (btn) btn.textContent = 'Sending...';
				var fd = new FormData(form);
				fd.append('action', 'mrspb_submit_form');
				fd.append('post_id', window.mrspbData.postId || 0);
				fd.append('form_id', form.getAttribute('data-form-id') || '');
				fetch(window.mrspbData.ajaxUrl, { method: 'POST', body: fd })
					.then(function (r) { return r.json(); })
					.then(function () {
						form.innerHTML = '<div class="mrspb-form-message">' + (window.mrspbData.strings.success || 'Thank you!') + '</div>';
					})
					.catch(function () {
						if (btn) btn.textContent = original;
						alert('Error sending form. Please try again.');
					});
			});
		});

		// Countdown timers
		document.querySelectorAll('.mrspb-countdown').forEach(function (el) {
			var target = new Date(el.getAttribute('data-target-date')).getTime();
			if (!target) return;
			var parts = el.querySelectorAll('[data-countdown-part]');
			var timer = setInterval(function () {
				var now = Date.now();
				var diff = target - now;
				if (diff <= 0) { clearInterval(timer); diff = 0; }
				var map = {
					days: Math.floor(diff / 86400000),
					hours: Math.floor((diff % 86400000) / 3600000),
					minutes: Math.floor((diff % 3600000) / 60000),
					seconds: Math.floor((diff % 60000) / 1000)
				};
				parts.forEach(function (part) {
					var k = part.getAttribute('data-countdown-part');
					if (map[k] !== undefined) {
						part.textContent = ('0' + map[k]).slice(-2);
					}
				});
			}, 1000);
		});

		// FAQ accordion
		document.querySelectorAll('.mrspb-faq-question').forEach(function (q) {
			q.addEventListener('click', function () {
				this.parentElement.classList.toggle('open');
			});
		});

		// Pricing toggle
		document.querySelectorAll('.mrspb-pricing-toggle').forEach(function (toggle) {
			toggle.addEventListener('change', function () {
				var monthly = this.getAttribute('data-monthly-selector');
				var yearly = this.getAttribute('data-yearly-selector');
				if (monthly) {
					document.querySelectorAll(monthly).forEach(function (el) { el.style.display = this.checked ? 'none' : 'block'; }.bind(this));
				}
				if (yearly) {
					document.querySelectorAll(yearly).forEach(function (el) { el.style.display = this.checked ? 'block' : 'none'; }.bind(this));
				}
			});
		});

		// Star ratings
		document.querySelectorAll('.mrspb-star-rating').forEach(function (el) {
			var rating = parseFloat(el.getAttribute('data-rating')) || 0;
			var out = '';
			for (var i = 1; i <= 5; i++) {
				out += i <= rating ? '★' : '☆';
			}
			el.textContent = out;
		});

		// Cookie banner
		var cookieBanner = document.querySelector('.mrspb-cookie-banner');
		if (cookieBanner) {
			var acceptBtn = cookieBanner.querySelector('.mrspb-cookie-accept');
			try {
				if (localStorage.getItem('mrspb_cookie') === '1') {
					cookieBanner.style.display = 'none';
				}
			} catch (e) {}
			if (acceptBtn) {
				acceptBtn.addEventListener('click', function () {
					cookieBanner.style.display = 'none';
					try { localStorage.setItem('mrspb_cookie', '1'); } catch (e) {}
				});
			}
		}
	});
})();
