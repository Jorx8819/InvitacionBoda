/**
 * JORGE & CONXY - INVITACIÓN MÁGICA
 * Versión Final Corregida (Sin bloqueos en cajas)
 */

let personajeElegido = 'novio';

// ==========================================
// ESCENA 1: INTRO (SOBRE Y BOTÓN)
// ==========================================
class EscenaIntro extends Phaser.Scene {
    constructor() { super('EscenaIntro'); }
    
    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.image('chispa', 'https://labs.phaser.io/assets/particles/yellow.png');
        this.load.audio('escribir', 'music/escribir.mp3'); 
        this.load.audio('clic', 'music/clic.mp3'); 
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        this.sound.pauseOnBlur = false;
        const midX = 600; const midY = 300;
        this.add.image(midX, midY, 'fondo').setDisplaySize(1200, 600).setAlpha(0.2);
        
        this.sndEscribir = this.sound.add('escribir', { loop: true, volume: 0.5 });
        this.sndClic = this.sound.add('clic', { volume: 0.5 });

        WebFont.load({
            google: { families: ['Cinzel Decorative', 'Eagle Lake'] },
            active: () => { this.prepararSobre(midX, midY); }
        });
    }

    prepararSobre(midX, midY) {
        const cSobre = 0x5d4037;
        this.sobreContainer = this.add.container(midX, midY);
        this.trasera = this.add.rectangle(0, 0, 420, 280, cSobre).setStrokeStyle(4, 0x3e2723);
        this.textoAd = this.add.text(0, 0, 'SOLO PARA MAGOS\nY BRUJAS', { fontSize: '25px', fill: '#d4af37', align: 'center', fontFamily: 'Cinzel Decorative' }).setOrigin(0.5);
        this.frontal = this.add.rectangle(0, 0, 420, 280, cSobre).setStrokeStyle(4, 0x3e2723).setVisible(false);
        this.solapa = this.add.graphics().setVisible(false).fillStyle(cSobre).lineStyle(4, 0x3e2723);
        this.solapa.fillTriangle(-210, 0, 210, 0, 0, 150).strokeTriangle(-210, 0, 210, 0, 0, 150);
        this.solapa.y = -140;
        
        this.papel = this.add.container(0, 0).setAlpha(0).setScale(0.1);
        const hoja = this.add.rectangle(0, 0, 380, 520, 0xfff4e0).setStrokeStyle(8, 0xd4af37);
        this.textoMagico = this.add.text(0, 0, '', { fontSize: '24px', fill: '#1a0f0a', fontFamily: 'Eagle Lake', align: 'center', wordWrap: { width: 320 } }).setOrigin(0.5);
        this.papel.add([hoja, this.textoMagico]);
        this.sobreContainer.add([this.papel, this.trasera, this.textoAd, this.frontal, this.solapa]);

        this.crearBotonAbrir(midX, midY + 220);
    }

    crearBotonAbrir(x, y) {
        const btn = this.add.container(x, y);
        const fondo = this.add.graphics().fillStyle(0x8b0000).fillRoundedRect(-100, -30, 200, 60, 15).lineStyle(3, 0xd4af37).strokeRoundedRect(-100, -30, 200, 60, 15);
        const txt = this.add.text(0, 0, 'ABRIR', { fontSize: '24px', fontFamily: 'Cinzel Decorative', fill: '#ffd700' }).setOrigin(0.5);
        btn.add([fondo, txt]);

        fondo.setInteractive(new Phaser.Geom.Rectangle(-100, -30, 200, 60), Phaser.Geom.Rectangle.Contains);
        fondo.on('pointerup', () => {
            if (this.sound.context.state === 'suspended') this.sound.context.resume();
            this.sndClic.play();
            btn.destroy();
            this.animarSobre();
        });
    }

    animarSobre() {
        this.tweens.add({
            targets: this.sobreContainer, scaleX: 0, duration: 500, yoyo: true,
            onYoyo: () => { this.trasera.setVisible(false); this.textoAd.setVisible(false); this.frontal.setVisible(true); this.solapa.setVisible(true); },
            onComplete: () => {
                this.tweens.add({ targets: this.solapa, scaleY: -1, duration: 500, onComplete: () => {
                    this.papel.setPosition(600, 300); this.sobreContainer.remove(this.papel); this.add.existing(this.papel).setDepth(100);
                    this.tweens.add({
                        targets: this.papel, scale: 1.1, alpha: 1, angle: 360, duration: 1200,
                        onComplete: () => { this.escribirTexto("Habéis sido elegidos...\n\n20.06.2026\n\n¿Aceptáis el desafío?"); }
                    });
                }});
            }
        });
    }

    escribirTexto(m) {
        let i = 0; this.sndEscribir.play();
        this.time.addEvent({ delay: 50, repeat: m.length - 1, callback: () => { 
            this.textoMagico.text += m[i]; i++; 
            if (i === m.length) { this.sndEscribir.stop(); this.crearSello(); } 
        }});
    }

    crearSello() {
        const sello = this.add.circle(600, 510, 50, 0x8b0000).setInteractive().setDepth(200);
        this.add.text(600, 510, 'ENTRAR', { fontSize: '18px', fontFamily: 'Cinzel Decorative', fill: '#ffd700' }).setOrigin(0.5).setDepth(201);
        sello.on('pointerup', () => { this.sndClic.play(); this.cameras.main.fadeOut(800); this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('EscenaSeleccion')); });
    }
}

// ==========================================
// ESCENA 2: SELECCIÓN
// ==========================================
class EscenaSeleccion extends Phaser.Scene {
    constructor() { super('EscenaSeleccion'); }
    preload() {
        this.load.image('fondo', 'img/fondo.jpg');
        this.load.image('btn_novio', 'img/novio_frente.png');
        this.load.image('btn_novia', 'img/novia_frente.png');
    }
    create() {
        this.add.image(600, 300, 'fondo').setDisplaySize(1200, 600).setAlpha(0.5);
        this.add.text(600, 100, 'ELIGE TU PERSONAJE', { fontSize: '40px', fill: '#fff', fontFamily: 'Cinzel Decorative' }).setOrigin(0.5);
        const n = this.add.image(400, 350, 'btn_novio').setScale(1.8).setInteractive();
        const m = this.add.image(800, 350, 'btn_novia').setScale(1.8).setInteractive();
        n.on('pointerup', () => { personajeElegido = 'novio'; this.scene.start('EscenaJuego'); });
        m.on('pointerup', () => { personajeElegido = 'novia'; this.scene.start('EscenaJuego'); });
    }
}

// ==========================================
// ESCENA 3: JUEGO (PLATAFORMAS)
// ==========================================
class EscenaJuego extends Phaser.Scene {
    constructor() { super('EscenaJuego'); }

    preload() {
        this.load.image('lejano', 'img/fondo_lejano.jpg');
        this.load.image('medio', 'img/fondo_medio.jpg');
        this.load.image('suelo', 'img/suelo.png');
        this.load.image('caja_animada_j', 'img/caja_animada_j.png');
        this.load.image('caja_animada_c', 'img/caja_animada_c.png');
        this.load.image('corazon', 'img/corazon.png');
        this.load.image('perro', 'img/perro.png');
        this.load.image('localizacion', 'img/localizacion.png');
        
        const p = ['novio', 'novia'];
        const f = ['frente', 'derecha', 'izquierda', 'corazon_derecha', 'corazon_izquierda'];
        p.forEach(pers => f.forEach(ori => this.load.image(`${pers}_${ori}`, `img/${pers}_${ori}.png`)));

        this.load.audio('musica', 'music/musica.mp3');
        this.load.audio('salto', 'music/salto.mp3');
        this.load.audio('caja_snd', 'music/caja'); // Según tu lista sin extensión
    }

    create() {
        const anchoNivel = 4000;
        this.juegoTerminado = false;
        this.bgLejano = this.add.tileSprite(0, 0, 1200, 600, 'lejano').setOrigin(0).setScrollFactor(0);
        this.bgMedio = this.add.tileSprite(0, 0, 1200, 600, 'medio').setOrigin(0).setScrollFactor(0);

        this.physics.world.setBounds(0, 0, anchoNivel, 600);
        this.plataformaSuelo = this.add.tileSprite(anchoNivel/2, 585, anchoNivel, 32, 'suelo');
        this.physics.add.existing(this.plataformaSuelo, true);

        this.jugador = this.physics.add.sprite(100, 450, personajeElegido + '_frente').setCollideWorldBounds(true);
        this.pareja = this.physics.add.sprite(3850, 450, (personajeElegido === 'novio' ? 'novia' : 'novio') + '_frente');
        this.perro = this.physics.add.sprite(3500, 500, 'perro').setAlpha(0);

        this.physics.add.collider([this.jugador, this.pareja, this.perro], this.plataformaSuelo);
        this.cameras.main.setBounds(0, 0, anchoNivel, 600).startFollow(this.jugador, true, 0.1, 0.1);

        this.musicaFondo = this.sound.add('musica', { loop: true, volume: 0.3 });
        this.musicaFondo.play();

        this.crearControles();
        this.crearCajas();
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.physics.add.overlap(this.jugador, this.pareja, () => this.finalizar());
    }

    update() {
        if (this.juegoTerminado) return;
        this.bgLejano.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.bgMedio.tilePositionX = this.cameras.main.scrollX * 0.6;

        const izq = this.cursors.left.isDown || this.btnIzq;
        const der = this.cursors.right.isDown || this.btnDer;

        if (izq) { this.jugador.setVelocityX(-320).setTexture(personajeElegido + '_izquierda'); }
        else if (der) { this.jugador.setVelocityX(320).setTexture(personajeElegido + '_derecha'); }
        else { this.jugador.setVelocityX(0).setTexture(personajeElegido + '_frente'); }

        if ((this.cursors.up.isDown || this.btnSalto) && this.jugador.body.touching.down) {
            this.jugador.setVelocityY(-850); 
            this.sound.play('salto');
        }
    }

    crearCajas() {
        this.txtCaja = this.add.text(0, 0, '', { 
            fontSize: '22px', fill: '#fff', backgroundColor: '#8b0000', padding: 8, fontFamily: 'Arial' 
        }).setVisible(false).setDepth(2000).setOrigin(0.5);

        const tex = (personajeElegido === 'novio') ? 'caja_animada_j' : 'caja_animada_c';
        this.grupoCajas = this.physics.add.staticGroup();

        const configCajas = [
            {x: 800, m: "¡BIENVENIDOS!"}, 
            {x: 1800, m: "20 JUNIO 2026"}, 
            {x: 2800, m: "¡CASI LLEGAS!"}
        ];

        configCajas.forEach(o => {
            let c = this.grupoCajas.create(o.x, 430, tex);
            c.mensaje = o.m;
            c.disponible = true;
        });

        // Colisión sólida (para caminar encima)
        this.physics.add.collider(this.jugador, this.grupoCajas);

        // Overlap (para detectar el golpe de cabeza sin bloquearse)
        this.physics.add.overlap(this.jugador, this.grupoCajas, (jugador, caja) => {
            // Si el jugador choca por arriba de su cabeza mientras salta
            if (jugador.body.touching.up && caja.body.touching.down && caja.disponible) {
                caja.disponible = false;
                this.sound.play('caja_snd');
                
                this.tweens.add({
                    targets: caja, y: 410, duration: 100, yoyo: true,
                    onComplete: () => {
                        this.txtCaja.setPosition(caja.x, caja.y - 70).setText(caja.mensaje).setVisible(true);
                        this.time.delayedCall(2000, () => {
                            this.txtCaja.setVisible(false);
                            caja.disponible = true;
                        });
                    }
                });
            }
        });
    }

    finalizar() {
        if (this.juegoTerminado) return; this.juegoTerminado = true;
        this.jugador.setVelocity(0);
        
        const suffix = (personajeElegido === 'novio') ? '_corazon_derecha' : '_corazon_izquierda';
        const pSuffix = (personajeElegido === 'novio') ? '_corazon_izquierda' : '_corazon_derecha';
        
        this.jugador.setTexture(personajeElegido + suffix);
        this.pareja.setTexture((personajeElegido === 'novio' ? 'novia' : 'novio') + pSuffix);

        this.add.image(this.pareja.x, this.pareja.y - 120, 'corazon').setScale(1.5).setDepth(2000);
        this.perro.setAlpha(1);
        this.tweens.add({ targets: this.perro, x: 3750, duration: 1500, onComplete: () => this.botonesFinales() });
    }

    botonesFinales() {
        const xCent = this.cameras.main.worldView.centerX;
        const yCent = this.cameras.main.worldView.centerY;

        this.add.text(3750, 350, "¡GUAU! ¡VIVAN LOS NOVIOS!", { 
            fontSize: '24px', fill: '#fff', backgroundColor: '#000', fontWeight: 'bold' 
        }).setOrigin(0.5);

        // Botón Confirmar (WhatsApp)
        let b1 = this.add.rectangle(xCent - 150, yCent, 240, 80, 0x25d366).setScrollFactor(0).setInteractive().setDepth(3000);
        this.add.text(xCent - 150, yCent, 'CONFIRMAR', { fontSize: '22px', color: '#fff' }).setOrigin(0.5).setScrollFactor(0).setDepth(3001);

        // Botón Ubicación
        let b2 = this.add.image(xCent + 150, yCent, 'localizacion').setScrollFactor(0).setInteractive().setScale(0.8).setDepth(3000);

        b1.on('pointerup', () => window.open('https://wa.me/34600000000', '_blank'));
        b2.on('pointerup', () => {
            const dir = "Finca Pico Vivero M-305, 35 KM, 28300 Aranjuez, Madrid";
            window.open(`http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(dir)}`, '_blank');
        });
    }

    crearControles() {
        const crear = (x, y, t, k) => {
            let b = this.add.circle(x, y, 60, 0xffffff, 0.2).setScrollFactor(0).setInteractive().setDepth(5000);
            this.add.text(x, y, t, { fontSize: '45px' }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);
            b.on('pointerdown', () => this[k] = true); 
            b.on('pointerup', () => this[k] = false);
            b.on('pointerout', () => this[k] = false);
        };
        crear(120, 500, '←', 'btnIzq'); 
        crear(280, 500, '→', 'btnDer'); 
        crear(1080, 500, '↑', 'btnSalto');
    }
}

// ==========================================
// CONFIGURACIÓN GLOBAL
// ==========================================
const config = {
    type: Phaser.AUTO,
    scale: { 
        mode: Phaser.Scale.FIT, 
        autoCenter: Phaser.Scale.CENTER_BOTH, 
        width: 1200, 
        height: 600, 
        parent: 'game-container' 
    },
    physics: { 
        default: 'arcade', 
        arcade: { gravity: { y: 1800 }, debug: false } 
    },
    scene: [EscenaIntro, EscenaSeleccion, EscenaJuego]
};

new Phaser.Game(config);