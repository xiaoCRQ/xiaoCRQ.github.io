const photobox = {
  init() {
    if (this.img_width = Math.floor(this.refer_width / this.refer_scale), this.img_height = Math.floor(this.refer_height / this.refer_scale), this.container = document.getElementById("photos"), this.canvas = document.querySelector(".photos_photobox"), this.context = this.canvas.getContext("2d"), this.checkbox.img = document.querySelector(".photos_checkbox_img"), this.checkbox.mover = [...document.querySelectorAll(".photos_checkbox_mover")], this.mousetip.ele = document.querySelector(".photos_mousetip"), this.img_mask = new Image, this.img_mask.src = t(3184), window.addEventListener("wheel", this.wheel), window.addEventListener("resize", this.resize), this.resize(), this.complement_data(), this.create_canvas_events(), this.create_imgs_data(), navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) return this.mousetip.if_render = !1;
    this.bind_mousetip_events()
  },
  complement_data() {
    let i = this.json_photos_data.length;
    while (1) {
      let a = Math.ceil(Math.sqrt(i)),
        t = Math.floor(Math.sqrt(i));
      if (a <= t + 1 && (a = t + 2), a * t >= i && a - t >= 2) {
        this.row_nums = a, this.line_nums = t, this.img_total = a * t, this.total_width = this.row_nums * (this.img_width + this.img_margin) - this.img_margin, this.total_height = this.line_nums * (this.img_height + this.img_margin) - this.img_margin;
        break
      }
      i++
    }
  },
  resize() {
    this.scale_nums = innerWidth / this.standard_width / 2 + innerHeight / this.standard_height / 2, this.draw_scale = this.scale_nums * devicePixelRatio, this.canvas.width = this.canvas.clientWidth * devicePixelRatio, this.canvas.height = this.canvas.clientHeight * devicePixelRatio, s.ZP.set(this.checkbox.mover, {
      width: this.img_width * this.scale_nums + "px",
      height: this.img_height * this.scale_nums + "px",
      x: (innerWidth - this.img_width * this.scale_nums) / 2 + "px",
      y: (innerHeight - this.img_height * this.scale_nums) / 2 - 40 * this.scale_nums + "px"
    }), 0 != this.imgs_data.length && this.move_imgs(0, 0)
  },
  create_imgs_data() {
    for (let i = 0; i < this.img_total; i++) {
      let a = this.json_photos_data.length - 1,
        t = parseInt(a / 2),
        x = i <= a ? i : i % (t + 1) + t,
        e = new Image(this.img_width, this.img_height);
      e.src = `https://cdn.jiejoe.com/photos/${this.json_photos_data[x].imgurl}`;
      let s = i % this.row_nums,
        n = Math.floor(i / this.row_nums),
        r = s * (this.img_width + this.img_margin),
        o = n * (this.img_height + this.img_margin);
      s % 2 && (o -= (this.img_height + this.img_margin) / 2), this.imgs_data.push({
        x: r,
        y: o,
        name: this.json_photos_data[x].name,
        time: this.json_photos_data[x].time,
        index: i,
        if_show: !0,
        if_loaded: !1
      }), e.onload = () => {
        this.imgs_data[i].img = e, this.imgs_data[i].if_loaded = !0
      }
    }
  },
  create_canvas_events() {
    this.canvas.onmousedown = i => {
      this.if_movable = !0, this.mouse.x = i.x, this.mouse.y = i.y
    }, this.canvas.ontouchstart = i => {
      this.if_movable = !0, this.mouse.pro_x = this.mouse.x = i.touches[0].clientX, this.mouse.pro_y = this.mouse.y = i.touches[0].clientY
    }, this.canvas.onmouseup = i => {
      this.if_movable = !1, this.mouse.x == i.x && this.mouse.y == i.y && this.select_img(i.x, i.y)
    }, this.canvas.ontouchend = i => {
      this.if_movable = !1, this.mouse.pro_x == this.mouse.x && this.mouse.pro_y == this.mouse.y && this.select_img(this.mouse.x, this.mouse.y)
    }, this.canvas.onmouseleave = () => {
      this.if_movable = !1
    }, this.canvas.onmousemove = i => {
      this.if_movable && this.move_imgs(i.movementX, i.movementY)
    }, this.canvas.ontouchmove = i => {
      i.preventDefault(), this.if_movable && (this.move_imgs(i.touches[0].clientX - this.mouse.x, i.touches[0].clientY - this.mouse.y), this.mouse.x = i.touches[0].clientX, this.mouse.y = i.touches[0].clientY)
    }
  },
  wheel(i) {
    this.move_imgs(0, 10 * Math.sign(i.wheelDeltaY))
  },
  move_imgs(i, a) {
    if (this.checkbox.if_visible) return;
    this.ease.x += .2 * i, this.ease.y += .2 * a;
    const t = () => {
      if (this.context.clearRect(0, 0, this.canvas.width, this.canvas.height), this.imgs_data.forEach((i => {
        i.x += this.ease.x, i.x > this.total_width - this.img_width && (i.x -= this.total_width + this.img_margin), i.x < -this.img_width && (i.x += this.total_width + this.img_margin), i.y += this.ease.y, i.y > this.total_height - this.img_height && (i.y -= this.total_height + this.img_margin), i.y < -this.img_height && (i.y += this.total_height + this.img_margin), this.context.drawImage(i.if_loaded ? i.img : this.img_mask, i.x * this.draw_scale, i.y * this.draw_scale, this.img_width * this.draw_scale, this.img_height * this.draw_scale)
      })), this.ease.x = this.ease.damping(this.ease.x), this.ease.y = this.ease.damping(this.ease.y), Math.abs(this.ease.x) < .01 && Math.abs(this.ease.y) < .01) return this.ease.x = 0, this.ease.y = 0, void (this.ease.id = null);
      this.ease.id = requestAnimationFrame(t)
    };
    this.ease.id || (this.ease.id = requestAnimationFrame(t))
  },
  select_img(i, a) {
    this.imgs_inview = this.imgs_data.filter((i => i.x * this.scale_nums >= -this.img_width * this.scale_nums && i.x * this.scale_nums <= innerWidth && i.y * this.scale_nums >= -this.img_height * this.scale_nums && i.y * this.scale_nums <= innerHeight));
    let t = this.imgs_data.find((t => i >= t.x * this.scale_nums && i < t.x * this.scale_nums + this.img_width * this.scale_nums && a >= t.y * this.scale_nums && a < t.y * this.scale_nums + this.img_height * this.scale_nums));
    t && (this.img_selected = t, this.img_selected.if_show = !1, this.hidden_imgs(), this.show_checkbox(), this.change_imgs(!1))
  },
  check_hidden() {
    this.checkbox.if_animating || (this.hidden_checkbox(), this.change_imgs(!0))
  },
  show_checkbox() {
    this.checkbox.if_animating = !0, this.checkbox.state = !0, this.checkbox.if_visible = !0, this.mousetip.if_shutable = !0, this.checkbox.img.src = "", this.checkbox.img.src = this.img_selected.img.src, s.ZP.fromTo(this.checkbox.mover, {
      x: this.img_selected.x * this.scale_nums + "px",
      y: this.img_selected.y * this.scale_nums + "px"
    }, {
      x: (innerWidth - this.img_width * this.scale_nums) / 2 + "px",
      y: (innerHeight - this.img_height * this.scale_nums) / 2 - 40 * this.scale_nums + "px",
      scale: 1.2,
      duration: .8,
      ease: "power4.out",
      stagger: {
        from: "end",
        each: .04
      },
      onComplete: () => {
        this.checkbox.if_animating = !1
      }
    })
  },
  hidden_checkbox() {
    this.checkbox.if_animating = !0, this.checkbox.state = !1, this.mousetip.if_shutable = !1, s.ZP.to(this.checkbox.mover, {
      x: this.img_selected.x * this.scale_nums + "px",
      y: this.img_selected.y * this.scale_nums + "px",
      scale: 1,
      duration: .5,
      ease: "power3.out",
      stagger: {
        from: "end",
        each: .04
      },
      onComplete: () => {
        this.checkbox.if_animating = !1, this.checkbox.if_visible = !1, this.img_selected.if_show = !0, this.show_imgs()
      }
    })
  },
  change_imgs(i) {
    const a = () => t >= this.imgs_inview.length && (clearInterval(this.change_timer), this.imgs_inview.forEach((i => {
      i.if_green = !1
    })), !0);
    cancelAnimationFrame(this.ease.id), this.ease.id = null;
    let t = 0;
    this.change_timer = setInterval((() => {
      if (this.imgs_inview[t].index != this.img_selected.index || (t++, !a())) {
        if (this.imgs_inview[t].if_show = i, Math.random() > .7) {
          let i = Math.floor(Math.random() * (this.imgs_inview.length - t)) + t;
          this.imgs_inview[i].index != this.img_selected.index && (this.imgs_inview[i].if_green = !0)
        }
        i ? this.show_imgs() : this.hidden_imgs(), ++t, a()
      }
    }), 30)
  },
  show_imgs() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height), this.imgs_inview.forEach((i => {
      i.if_green && this.context.drawImage(this.img_mask, i.x * this.draw_scale, i.y * this.draw_scale, this.img_width * this.draw_scale, this.img_height * this.draw_scale), i.if_show && this.context.drawImage(i.img, i.x * this.draw_scale, i.y * this.draw_scale, this.img_width * this.draw_scale, this.img_height * this.draw_scale)
    }))
  },
  hidden_imgs() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height), this.imgs_inview.forEach((i => {
      i.if_show && (this.context.drawImage(i.img, i.x * this.draw_scale, i.y * this.draw_scale, this.img_width * this.draw_scale, this.img_height * this.draw_scale), i.if_green && this.context.drawImage(this.img_mask, i.x * this.draw_scale, i.y * this.draw_scale, this.img_width * this.draw_scale, this.img_height * this.draw_scale))
    }))
  },
  bind_mousetip_events() {
    this.container.onmousemove = this.move_mousetip, this.container.onmouseenter = this.show_mousetip, this.container.onmouseleave = this.hidden_mousetip, this.container.onmouseup = this.reset_mousetip
  },
  move_mousetip(i) {
    if (s.ZP.to(this.mousetip.ele, {
      x: `${i.x}px`,
      y: `${i.y}px`,
      duration: .5,
      ease: "power2.out"
    }), !this.if_movable) return;
    let a, t = (i.x - innerWidth / 2) / (i.y - innerHeight / 2);
    a = i.y >= innerHeight / 2 ? 180 * Math.atan(t) / Math.PI + 90 : 270 + 180 * Math.atan(t) / Math.PI;
    let x = this.mousetip.last_angle % 360;
    x < 0 && (x += 360);
    let e = a - x;
    e >= 180 ? e -= 360 : e < -180 && (e += 360), a = this.mousetip.last_angle + e, s.ZP.to(this.mousetip.ele, {
      rotate: -a + "deg",
      duration: .5,
      ease: "power2.out"
    }), this.mousetip.last_angle = a
  },
  show_mousetip(i) {
    s.ZP.timeline().to(this.mousetip.ele, {
      x: `${i.x}px`,
      y: `${i.y}px`,
      scale: 1,
      duration: .8,
      ease: "power3.out"
    })
  },
  hidden_mousetip() {
    this.reset_mousetip(), s.ZP.to(this.mousetip.ele, {
      scale: 0,
      duration: .8,
      ease: "power3.out"
    })
  },
  reset_mousetip() {
    s.ZP.timeline().set(this.mousetip.ele, {
      rotate: this.mousetip.last_angle % 360 + "deg"
    }).to(this.mousetip.ele, {
      rotate: "0deg",
      duration: .5,
      ease: "power2.out"
    }), this.mousetip.last_angle = 0
  },
  init_animation() {
    this.move_imgs(innerWidth / 4, 0)
  }
}

photobox.init()
