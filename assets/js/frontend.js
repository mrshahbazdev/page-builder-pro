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

		// Forms
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

		// Modals / popups
		document.querySelectorAll('[data-mrspb-open]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var target = document.getElementById(btn.getAttribute('data-mrspb-open'));
				if (target) {
					if (target.tagName.toLowerCase() === 'dialog') {
						target.showModal();
					} else {
						target.style.display = 'flex';
					}
				}
			});
		});
		document.querySelectorAll('[data-mrspb-close]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var target = btn.closest('.mrspb-modal') || document.getElementById(btn.getAttribute('data-mrspb-close'));
				if (target) {
					if (target.tagName.toLowerCase() === 'dialog') {
						target.close();
					} else {
						target.style.display = 'none';
					}
				}
			});
		});

		// Before / after slider
		document.querySelectorAll('.mrspb-before-after').forEach(function (el) {
			var slider = el.querySelector('.mrspb-slider');
			var afterWrap = el.querySelector('.mrspb-after-wrap');
			var handle = el.querySelector('.mrspb-handle');
			if (!slider || !afterWrap || !handle) return;
			slider.addEventListener('input', function () {
				var val = this.value + '%';
				afterWrap.style.width = val;
				handle.style.left = val;
			});
		});

		// Typewriter effect
		document.querySelectorAll('[data-typewriter]').forEach(function (el) {
			var raw = el.getAttribute('data-typewriter');
			var words = [];
			try { words = JSON.parse(raw); } catch (e) {}
			if (!Array.isArray(words) || !words.length) return;
			var speed = parseInt(el.getAttribute('data-typewriter-speed'), 10) || 120;
			var pause = parseInt(el.getAttribute('data-typewriter-pause'), 10) || 2000;
			var i = 0, j = 0, deleting = false;
			function tick() {
				var word = words[i];
				el.textContent = word.substring(0, j);
				if (!deleting && j < word.length) {
					j++;
					setTimeout(tick, speed);
				} else if (deleting && j > 0) {
					j--;
					setTimeout(tick, speed / 2);
				} else {
					deleting = !deleting;
					if (!deleting) i = (i + 1) % words.length;
					setTimeout(tick, deleting ? pause : 300);
				}
			}
			tick();
		});

		// Particles canvas
		document.querySelectorAll('.mrspb-particles').forEach(function (canvas) {
			var ctx = canvas.getContext('2d');
			if (!ctx) return;
			var color = canvas.getAttribute('data-color') || '#2563eb';
			var count = parseInt(canvas.getAttribute('data-count'), 10) || 50;
			var particles = [];
			function resize() {
				var rect = canvas.getBoundingClientRect();
				canvas.width = rect.width;
				canvas.height = rect.height;
			}
			resize();
			for (var p = 0; p < count; p++) {
				particles.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					dx: (Math.random() - 0.5) * 1,
					dy: (Math.random() - 0.5) * 1,
					r: Math.random() * 2 + 1
				});
			}
			function draw() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = color;
				particles.forEach(function (p) {
					p.x += p.dx;
					p.y += p.dy;
					if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
					if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
					ctx.fill();
				});
				requestAnimationFrame(draw);
			}
			draw();
			window.addEventListener('resize', resize, { passive: true });
		});

		// Pie chart SVG animation
		document.querySelectorAll('.mrspb-pie-chart svg circle.mrspb-pie').forEach(function (circle) {
			var value = parseFloat(circle.getAttribute('data-value')) || 0;
			var max = parseFloat(circle.getAttribute('data-max')) || 100;
			var radius = parseFloat(circle.getAttribute('r')) || 15.9;
			var circumference = 2 * Math.PI * radius;
			var target = circumference * (1 - value / max);
			circle.style.strokeDasharray = circumference + ' ' + circumference;
			circle.style.strokeDashoffset = circumference;
			setTimeout(function () {
				circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
				circle.style.strokeDashoffset = target;
			}, 200);
		});

		// Social share buttons
		document.querySelectorAll('[data-mrspb-share]').forEach(function (btn) {
			btn.addEventListener('click', function () {
				var network = btn.getAttribute('data-mrspb-share');
				var url = encodeURIComponent(window.location.href);
				var text = encodeURIComponent(document.title);
				if (network === 'facebook') {
					window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'width=600,height=400');
				} else if (network === 'twitter' || network === 'x') {
					window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + text, '_blank', 'width=600,height=400');
				} else if (network === 'linkedin') {
					window.open('https://www.linkedin.com/shareArticle?mini=true&url=' + url, '_blank', 'width=600,height=400');
				} else if (network === 'copy') {
					navigator.clipboard.writeText(window.location.href).catch(function () {});
					alert('Link copied to clipboard');
				}
			});
		});
	});
})();
