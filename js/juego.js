/**
 * ============================================================================
 * 💍 INVITACIÓN DE BODA MÁGICA - JORGE & CONXY
 * CORRECCIÓN VISUAL: FONDOS AJUSTADOS, PERRO VISIBLE Y TEXTOS FIX
 * ============================================================================
 */

let personajeElegido = 'novio';

// --- DIMENSIONES FIJAS PARA MODO FIT ---
// Esto asegura que se vea igual en todos los móviles
const GAME_WIDTH = 1280;
const GAME_HEIGHT = 720;

class EscenaIntro extends Phaser.Scene {
    constructor() { super('EscenaIntro'); }
    
    preload() {
        this.load.image('fondo_menu', 'img/fondo.jpg');
        this.load.image('chispa', 'https://labs.phaser.io/assets/particles/yellow.png');
        this.load.audio('sonido_escribir', 'music/escribir.mp3'); 
        this.load.audio('clic', 'music/clic.mp3'); 
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        this.sound.pauseOnBlur = false;
        
        // CORRECCIÓN FONDO: Forzamos el tamaño para cubrir la pantalla
        this.fondo = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'fondo_menu')
            .setAlpha(0.2)
            .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        this.sndEscribir = this.sound.add('sonido_escribir', { loop: true, volume: 0.5 });
        this.sndClic = this.sound.add('clic', { volume: 0.5 });
        
        WebFont.load({
            google: { families: ['Cinzel Decorative', 'Eagle Lake'] },
            active: () => { this.prepararSobre(); }
        });
    }

    prepararSobre() {
        const midX = GAME_WIDTH / 2;
        const midY = GAME_HEIGHT / 2;
        const cSobre = 0x5d4037; 

        this.sobreContainer = this.add.container(midX, midY);
        
        this.trasera = this.add.rectangle(0, 0, 420, 280, cSobre).setStrokeStyle(4, 0x3e2723);
        this.textoAd = this.add.text(0, 0, 'SOLO PARA MAGOS\nY BRUJAS', { 
            fontSize: '25px', fill: '#d4af37', align: 'center', fontFamily: 'Cinzel Decorative' 
        }).setOrigin(0.5);
        
        this.frontal = this.add.rectangle(0, 0, 420, 280, cSobre).setStrokeStyle(4, 0x3e2723).setVisible(false);
        this.solapa = this.add.graphics().setVisible(false).fillStyle(cSobre).lineStyle(4, 0x3e2723);
        this.solapa.fillTriangle(-210, 0, 210, 0, 0, 150).strokeTriangle(-210, 0, 210, 0, 0, 150);
        this.solapa.y = -140; 
        
        this.papel = this.add.container(0, 0).setAlpha(0).setScale(0.1);
        const hoja = this.add.rectangle(0, 0, 380, 520, 0xfff4e0).setStrokeStyle(8, 0xd4af37); 
        this.textoMagico = this.add.text(0, 0, '', { 
            fontSize: '24px', fill: '#1a0f0a', fontFamily: 'Eagle Lake', align: 'center', wordWrap: { width: 320 } 
        }).setOrigin(0.5);
        
        this.papel.add([hoja, this.textoMagico]);
        this.sobreContainer.add([this.papel, this.trasera, this.textoAd, this.frontal, this.solapa]);
        
        this.crearBotonCristalMistico(midX, midY + 200);
    }

    crearBotonCristalMistico(x, y) {
        this.btnContainer = this.add.container(x, y);
        const aura = this.add.graphics();
        aura.fillStyle(0xffd700, 0.2); aura.fillCircle(0, 0, 80);
        this.btnContainer.add(aura);
        
        this.tweens.add({ targets: aura, scale: 1.5, alpha: 0, duration: 2000, repeat: -1 });
        
        this.emisorBot = this.add.particles(0, 0, 'chispa', { 
            speed: { min: 10, max: 40 }, 
            scale: { start: 0.3, end: 0 }, 
            alpha: { start: 0.8, end: 0 }, 
            lifespan: 1200, 
            blendMode: 'ADD', 
            frequency: 60, 
            tint: [0xffd700, 0xffaa00, 0xffffff] 
        });
        
        const fondo = this.add.graphics();
        fondo.fillGradientStyle(0x8b0000, 0x8b0000, 0x330000, 0x330000, 1);
        fondo.fillRoundedRect(-110, -35, 220, 70, 20);
        fondo.lineStyle(4, 0xd4af37, 1);
        fondo.strokeRoundedRect(-110, -35, 220, 70, 20);
        
        const txt = this.add.text(0, 0, 'ABRIR', { 
            fontSize: '28px', fontFamily: 'Cinzel Decorative', fill: '#ffd700', fontWeight: 'bold' 
        }).setOrigin(0.5);
        
        this.btnContainer.add([this.emisorBot, fondo, txt]);
        
        fondo.setInteractive(new Phaser.Geom.Rectangle(-110, -35, 220, 70), Phaser.Geom.Rectangle.Contains);
        fondo.on('pointerup', () => { 
            if (this.sound.context.state === 'suspended') this.sound.context.resume(); 
            this.sndClic.play(); 
            this.iniciarAnimacionSobre(); 
            this.btnContainer.destroy(); 
        });
    }

    iniciarAnimacionSobre() {
        this.tweens.add({ 
            targets: this.sobreContainer, scaleX: 0, duration: 600, yoyo: true, 
            onYoyo: () => { 
                this.trasera.setVisible(false); 
                this.textoAd.setVisible(false); 
                this.frontal.setVisible(true); 
                this.solapa.setVisible(true); 
            }, 
            onComplete: () => { 
                this.tweens.add({ 
                    targets: this.solapa, scaleY: -1, duration: 600, 
                    onComplete: () => { 
                        this.papel.setPosition(GAME_WIDTH / 2, GAME_HEIGHT / 2); 
                        this.sobreContainer.remove(this.papel); 
                        this.add.existing(this.papel).setDepth(100); 
                        
                        this.tweens.add({ 
                            targets: this.papel, scale: 1, alpha: 1, angle: 360, duration: 1500, ease: 'Back.easeOut', 
                            onComplete: () => { 
                                this.escribirTexto("Habéis sido elegidos para presenciar la unión de dos almas mágicas...\n\n04.07.2026\n\n¿Aceptáis el desafío?"); 
                            } 
                        }); 
                    } 
                }); 
            } 
        });
    }

    escribirTexto(m) {
        let i = 0; this.sndEscribir.play();
        this.time.addEvent({ 
            delay: 50, 
            repeat: m.length - 1, 
            callback: () => { 
                this.textoMagico.text += m[i]; 
                i++; 
                if (i === m.length) { 
                    this.sndEscribir.stop(); 
                    this.crearBotonEntrar(); 
                } 
            } 
        });
    }

    crearBotonEntrar() {
        const midX = GAME_WIDTH / 2;
        const midY = GAME_HEIGHT - 80; 
        const sello = this.add.circle(midX, midY, 50, 0x8b0000).setInteractive({ useHandCursor: true }).setDepth(200);
        this.add.text(midX, midY, 'ENTRAR', { fontSize: '20px', fontFamily: 'Cinzel Decorative', fill: '#ffd700' }).setOrigin(0.5).setDepth(201);
        
        sello.on('pointerup', () => { 
            this.sndClic.play(); 
            this.cameras.main.fadeOut(1000); 
            this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('EscenaSeleccion')); 
        });
    }
}

class EscenaSeleccion extends Phaser.Scene {
    constructor() { super('EscenaSeleccion'); }
    
    preload() {
        this.load.image('fondo_menu', 'img/fondo.jpg');
        this.load.image('btn_novio', 'img/novio_frente.png');
        this.load.image('btn_novia', 'img/novia_frente.png');
    }
    
    create() {
        const midX = GAME_WIDTH / 2;
        const midY = GAME_HEIGHT / 2;
        
        // CORRECCIÓN FONDO SELECCIÓN
        this.add.image(midX, midY, 'fondo_menu').setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0.5);
        this.add.text(midX, 100, 'ELIGE TU PERSONAJE', { fontSize: '42px', fill: '#fff', fontFamily: 'Cinzel Decorative' }).setOrigin(0.5);
        
        const n = this.add.image(midX - 200, midY, 'btn_novio').setScale(2).setInteractive({ useHandCursor: true });
        const m = this.add.image(midX + 200, midY, 'btn_novia').setScale(2).setInteractive({ useHandCursor: true });
        
        n.on('pointerup', () => { personajeElegido = 'novio'; this.scene.start('EscenaJuego'); });
        m.on('pointerup', () => { personajeElegido = 'novia'; this.scene.start('EscenaJuego'); });
    }
}

class EscenaJuego extends Phaser.Scene {
    constructor() { super('EscenaJuego'); }
    
    preload() {
        this.load.image('lejano', 'img/fondo_lejano.jpg');
        this.load.image('medio', 'img/fondo_medio.jpg');
        this.load.image('suelo', 'img/suelo.png');
        this.load.image('caja_j', 'img/caja_animada_j.png');
        this.load.image('caja_c', 'img/caja_animada_c.png');
        this.load.image('boton_confirmar', 'img/boton_confirmar.png');
        this.load.image('boton_localizacion', 'img/localizacion.png');
        this.load.image('moneda_pixel', 'img/moneda_pixel.png');
        this.load.image('corazon', 'img/corazon.png');
        this.load.image('perro', 'img/perro.png');
        this.load.image('fantasma', 'img/fantasma.png');
        this.load.image('plataforma', 'img/plataforma.png');
        this.load.image('novio_frente', 'img/novio_frente.png');
        this.load.image('novio_der', 'img/novio_derecha.png');
        this.load.image('novio_izq', 'img/novio_izquierda.png');
        this.load.image('novio_fin', 'img/novio_corazon_derecha.png');
        this.load.image('novia_frente', 'img/novia_frente.png');
        this.load.image('novia_der', 'img/novia_derecha.png');
        this.load.image('novia_izq', 'img/novia_izquierda.png');
        this.load.image('novia_fin', 'img/novia_corazon_izquierda.png');
        this.load.audio('musica', 'music/musica.mp3');
        this.load.audio('salto', 'music/salto.mp3');
        this.load.audio('sonido_caja', 'music/caja.mp3');
        this.load.audio('ladrido', 'music/ladrido.mp3');
        this.load.audio('collect', 'music/collect.mp3');
        this.load.audio('bump', 'music/bump.mp3');
    }
    
    create() {
        this.input.addPointer(3);
        const anchoNivel = 6000;
        this.juegoTerminado = false; 
        this.puntos = 0; 
        this.invulnerable = false;
        
        // CORRECCIÓN VITAL DEL FONDO:
        // setDisplaySize fuerza a la imagen a ocupar todo el alto (720px), eliminando el borde cortado.
        this.bgLejano = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'lejano')
            .setOrigin(0).setScrollFactor(0);
        this.bgLejano.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

        this.bgMedio = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'medio')
            .setOrigin(0).setScrollFactor(0);
        this.bgMedio.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
        
        this.physics.world.setBounds(0, 0, anchoNivel, GAME_HEIGHT);
        
        // SUELO
        this.sueloGroup = this.physics.add.staticGroup();
        for (let x = 0; x < anchoNivel; x += 64) { 
            // Ponemos el suelo físico en la base de la pantalla
            this.sueloGroup.create(x, GAME_HEIGHT - 32, 'suelo')
                .setDisplaySize(64, 64)
                .refreshBody(); 
        }
        
        // PLATAFORMAS
        this.plataformas = this.physics.add.group({ allowGravity: false, immovable: true });
        const cp = [1200, 2100, 3000, 3900, 4800];
        cp.forEach(px => { 
            let p = this.plataformas.create(px, GAME_HEIGHT - 180, 'plataforma'); 
            p.body.checkCollision.down = false; 
        });
        
        // JUGADOR
        this.jugador = this.physics.add.sprite(100, GAME_HEIGHT - 150, personajeElegido + '_frente')
            .setCollideWorldBounds(true).setDepth(100);
        
        // PAREJA Y PERRO
        this.pareja = this.physics.add.sprite(5850, GAME_HEIGHT - 150, (personajeElegido === 'novio' ? 'novia' : 'novio') + '_frente')
            .setDepth(100);
            
        // CORRECCIÓN PERRO: Depth muy alto para que no se oculte tras el fondo
        this.perro = this.physics.add.sprite(6000, GAME_HEIGHT - 100, 'perro')
            .setScale(0.8).setAlpha(0).setDepth(5000).setFlipX(true);
        
        this.physics.add.collider(this.jugador, this.sueloGroup);
        this.physics.add.collider(this.jugador, this.plataformas);
        this.physics.add.collider(this.pareja, this.sueloGroup);
        this.physics.add.collider(this.perro, this.sueloGroup);
        
        this.cameras.main.setBounds(0, 0, anchoNivel, GAME_HEIGHT);
        this.cameras.main.startFollow(this.jugador, true, 0.1, 0.1, 0, 70);
        
        this.textoPuntos = this.add.text(16, 16, 'MONEDAS: 0/10', { 
            fontSize: '32px', fill: '#fff', fontFamily: 'Cinzel Decorative', stroke: '#000', strokeThickness: 4 
        }).setScrollFactor(0).setDepth(2000);
        
        this.musicaFondo = this.sound.add('musica', { loop: true, volume: 0.1 });
        this.sndSalto = this.sound.add('salto', { volume: 0.4 });
        this.sndCaja = this.sound.add('sonido_caja', { volume: 0.5 });
        this.sndLadrido = this.sound.add('ladrido', { volume: 0.6 });
        this.sndCollect = this.sound.add('collect', { volume: 0.5 });
        this.sndBump = this.sound.add('bump', { volume: 0.5 });
        
        this.configurarCajasYMonedas(cp); 
        this.crearObstaculos(); 
        this.crearControlesMovil();
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.overlap(this.jugador, this.pareja, () => this.finalizarJuego());
    }

    crearControlesMovil() {
        this.btnIzq = false; this.btnDer = false; this.btnSalto = false;
        
        const btnY = GAME_HEIGHT - 100;
        const sb = (x, y, t, p) => {
            let b = this.add.circle(x, y, 70, 0xffffff, 0.2)
                .setScrollFactor(0).setDepth(5000).setInteractive();
            this.add.text(x, y, t, { fontSize: '50px' })
                .setOrigin(0.5).setScrollFactor(0).setDepth(5001);
            b.on('pointerdown', () => { this[p] = true; b.setAlpha(0.5); });
            b.on('pointerup', () => { this[p] = false; b.setAlpha(0.2); });
            b.on('pointerout', () => { this[p] = false; b.setAlpha(0.2); });
        };
        sb(100, btnY, '◀', 'btnIzq');
        sb(260, btnY, '▶', 'btnDer');
        sb(GAME_WIDTH - 100, btnY, '▲', 'btnSalto');
    }

    configurarCajasYMonedas(cp) {
        this.textoCartel = this.add.text(0, 0, '', { 
            fontSize: '24px', fill: '#fff', backgroundColor: '#8b0000', padding: { x: 15, y: 10 }, 
            align: 'center', wordWrap: { width: 400 } 
        }).setOrigin(0.5, 1).setVisible(false).setDepth(2000).setStroke('#d4af37', 4);
        
        const tc = (personajeElegido === 'novio') ? 'caja_j' : 'caja_c';
        const ms = ["¡COMIENZA LA AVENTURA!", "CUIDADO CON LAS POCIONES...", "EL 4 DE JULIO DE 2026", "EN ARANJUEZ NOS VEMOS", "TRAED VUESTRAS VARITAS", "¡VIVAN LOS NOVIOS!"];
        
        this.monedas = this.physics.add.group();
        
        cp.forEach((px, i) => {
            this.monedas.create(px, GAME_HEIGHT - 220, 'moneda_pixel').setScale(1.2).body.setAllowGravity(false);
            let c = this.add.sprite(px + 60, GAME_HEIGHT - 320, tc); 
            this.physics.add.existing(c, true);
            c.mensaje = ms[i] || "¡MÁGICO!"; 
            c.disponible = true; 
            this.vincularColisionCaja(c);
        });
        
        for(let j=0; j<5; j++) { 
            this.monedas.create(600 + (j * 1100), GAME_HEIGHT - 120, 'moneda_pixel')
                .setScale(1.2).body.setAllowGravity(false); 
        }
        
        this.physics.add.overlap(this.jugador, this.monedas, (p, m) => { 
            m.destroy(); 
            this.puntos++; 
            this.textoPuntos.setText(`MONEDAS: ${this.puntos}/10`); 
            this.sndCollect.play(); 
        });
    }

    vincularColisionCaja(c) {
        this.physics.add.collider(this.jugador, c, (o1, o2) => {
            if (o1.body.touching.up && o2.body.touching.down && c.disponible) { 
                c.disponible = false; 
                this.sndCaja.play();
                this.textoCartel.setPosition(c.x, c.y - 60)
                    .setText(c.mensaje).setVisible(true).setScale(0).setAlpha(1);
                this.tweens.add({ targets: this.textoCartel, scale: 1, duration: 300, ease: 'Back.easeOut' });
                this.time.delayedCall(2500, () => { 
                    this.tweens.add({ 
                        targets: this.textoCartel, alpha: 0, duration: 500, 
                        onComplete: () => { this.textoCartel.setVisible(false); c.disponible = true; }
                    }); 
                });
            }
        });
    }

    crearObstaculos() {
        this.fantasmas = this.physics.add.group({ allowGravity: false });
        const pf = [1500, 2600, 3500, 4400, 5200];
        pf.forEach(dx => {
            let f = this.fantasmas.create(dx, GAME_HEIGHT - 70, 'fantasma').setScale(1.5);
            this.tweens.add({ targets: f, x: dx + 300, duration: 2000, yoyo: true, repeat: -1 });
        });
        this.physics.add.overlap(this.jugador, this.fantasmas, () => {
            if (!this.invulnerable && !this.juegoTerminado) {
                this.invulnerable = true; 
                this.sndBump.play();
                this.jugador.setVelocityX(-200); 
                this.jugador.setVelocityY(-300);
                this.tweens.add({ 
                    targets: this.jugador, alpha: 0.3, duration: 100, yoyo: true, repeat: 5, 
                    onComplete: () => { this.invulnerable = false; this.jugador.setAlpha(1); } 
                });
            }
        });
    }

    update() {
        if (this.juegoTerminado) return;
        
        // Parallax corregido
        this.bgLejano.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.bgMedio.tilePositionX = this.cameras.main.scrollX * 0.6;
        
        const izq = this.cursors.left.isDown || this.btnIzq;
        const der = this.cursors.right.isDown || this.btnDer;
        const salto = this.cursors.up.isDown || this.btnSalto;
        
        if (!this.invulnerable) {
            if (izq) { 
                this.jugador.setVelocityX(-320).setTexture(personajeElegido + '_izq'); 
            } else if (der) { 
                this.jugador.setVelocityX(320).setTexture(personajeElegido + '_der'); 
                if(!this.musicaFondo.isPlaying) this.musicaFondo.play(); 
            } else { 
                this.jugador.setVelocityX(0).setTexture(personajeElegido + '_frente'); 
            }
        }
        
        if (salto && this.jugador.body.touching.down) { 
            this.jugador.setVelocityY(-850); 
            this.sndSalto.play(); 
        }
    }

    finalizarJuego() {
        if (this.juegoTerminado) return;
        this.juegoTerminado = true; 
        this.jugador.setVelocity(0); 
        this.textoPuntos.setVisible(false);
        
        // Centramos la cámara suavemente en la pareja para asegurar que se ve el perro
        this.cameras.main.stopFollow();
        this.cameras.main.pan(this.pareja.x, GAME_HEIGHT / 2, 1000, 'Sine.easeInOut');

        if (personajeElegido === 'novio') { 
            this.jugador.setTexture('novio_fin'); 
            this.pareja.setTexture('novia_fin'); 
        } else { 
            this.jugador.setTexture('novia_fin').setFlipX(true); 
            this.pareja.setTexture('novio_fin').setFlipX(true); 
        }
        
        let co = this.add.image(this.pareja.x - 20, this.pareja.y - 120, 'corazon').setDepth(1000);
        this.tweens.add({ targets: co, scale: 8, alpha: 0, y: '-=250', duration: 2000 });
        
        // El perro se hace visible y se mueve
        this.perro.setAlpha(1);
        this.tweens.add({ 
            targets: this.perro, x: this.pareja.x - 150, duration: 1500, 
            onComplete: () => this.escribirMensajePerro() 
        });
    }

    escribirMensajePerro() {
        let m = "¡GUAU! ¡VIVAN LOS NOVIOS!\nTODOS LOS PERROS SON BIENVENIDOS";
        if (this.puntos >= 10) m = "¡INCREÍBLE! HAS RECOGIDO TODO EL AMOR.\n¡NOS VEMOS EL 4 DE JULIO!";
        
        // CORRECCIÓN TEXTO PERRO: Depth máximo y posición ajustada
        this.txtPerro = this.add.text(this.perro.x, this.perro.y - 150, "", { 
            fontSize: '24px', fill: '#ffd700', fontFamily: 'Cinzel Decorative', 
            align: 'center', stroke: '#000', strokeThickness: 5 
        }).setOrigin(0.5).setDepth(10001); // Profundidad máxima
        
        this.sndLadrido.play({ loop: true }); 
        
        let ci = 0;
        this.time.addEvent({ 
            delay: 70, repeat: m.length - 1, 
            callback: () => { 
                this.txtPerro.text += m[ci]; ci++; 
                if (ci === m.length) { 
                    this.sndLadrido.stop(); 
                    this.mostrarBotonesFinales(); 
                } 
            } 
        });
    }

    mostrarBotonesFinales() {
        // CORRECCIÓN BOTONES: Se calculan relativos a la cámara centrada
        const camX = this.cameras.main.scrollX + (GAME_WIDTH / 2);
        const camY = GAME_HEIGHT / 2;
        
        let bC = this.add.image(camX - 200, camY + 50, 'boton_confirmar')
            .setDepth(10002).setScale(0).setInteractive({useHandCursor:true});
            
        let bM = this.add.image(camX + 200, camY + 50, 'boton_localizacion')
            .setDepth(10002).setScale(0).setInteractive({useHandCursor:true});
            
        this.tweens.add({ targets: [bC, bM], scale: 0.8, duration: 800, ease: 'Back.easeOut' });
        
        bC.on('pointerup', () => { window.open('https://forms.gle/FtZQjSv3nVLyfUpx6', '_blank'); });
        bM.on('pointerup', () => { window.open('https://maps.app.goo.gl/Z1tjRdbwsvhHGo5SA', '_blank'); });
    }
}

const config = {
    type: Phaser.AUTO,
    scale: { 
        mode: Phaser.Scale.FIT,      
        autoCenter: Phaser.Scale.CENTER_BOTH, 
        parent: 'game-container',
        width: GAME_WIDTH,   
        height: GAME_HEIGHT  
    },
    physics: { 
        default: 'arcade', 
        arcade: { gravity: { y: 1900 }, debug: false } 
    },
    scene: [EscenaIntro, EscenaSeleccion, EscenaJuego]
};

const game = new Phaser.Game(config);
