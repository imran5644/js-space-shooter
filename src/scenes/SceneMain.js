import Phaser from 'phaser';
import ChaserShip from '../entities/ChaserShip';
import GreenShip from '../entities/GreenShip';
import GunShip from '../entities/GunShip';
import Player from '../entities/Player';
import ScrollingBackground from '../background/ScrollingBackground';

const inputField = document.querySelector('#utext');
const scoreDiv = document.querySelector('.scoreDiv');
const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${process.env.GAMEID}/scores/`;

const setScore = (name, score) => {
  const params = { user: name, score };
  if (params.user !== '' && params.score > 0) {
    fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).catch((error) => error);
  }
};

export default class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMain' });
  }

  preload() {
    this.load.image('bg', 'newBg.png');
    this.load.image('enemy', 'enemyBlue2.png');
    this.load.image('chaserEnemy', 'ufoGreen.png');
    this.load.image('lastEnemy', 'enemyGreen5.png');
    this.load.image('blueLaser', 'laserBlue05.png');
    this.load.image('greenLaser', 'laserGreen03.png');
    this.load.image('myLaser', 'laserRed01.png');
    this.load.spritesheet('ship', 'ship_spritesheet.png', {
      frameWidth: 99,
      frameHeight: 70,
    });
    this.load.audio('mars', 'Mars.wav');
    this.load.audio('explosion', 'explosion.mp3');
  }

  create() {
    const sfx = this.sound.add('mars');
    const explosionSound = this.sound.add('explosion');
    sfx.loop = true;
    sfx.play();

    this.anims.create({
      key: 'left',
      frames: [{ key: 'ship', frame: 0 }],
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'ship', frame: 1 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: [{ key: 'ship', frame: 2 }],
      frameRate: 10,
      repeat: 0,
    });

    this.backgrounds = [];
    for (let i = 0; i < 5; i += 1) {
      const bg = new ScrollingBackground(this, 'bg', i * 10);
      this.backgrounds.push(bg);
    }

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.enemies = this.add.group();
    this.enemyLasers = this.add.group();
    this.playerLasers = this.add.group();
    this.player = new Player(
      this,
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'ship',
      inputField.value,
    );

    this.time.addEvent({
      delay: 1000,
      callback() {
        let enemy = null;

        if (Phaser.Math.Between(0, 10) < 5) {
          enemy = new GunShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0,
          );
        } else if (Phaser.Math.Between(0, 10) <= 7) {
          if (this.getEnemiesByType('ChaserShip').length < 5) {
            enemy = new ChaserShip(
              this,
              Phaser.Math.Between(0, this.game.config.width),
              0,
            );
          }
        } else {
          enemy = new GreenShip(
            this,
            Phaser.Math.Between(0, this.game.config.width),
            0,
          );
        }

        if (enemy !== null) {
          this.enemies.add(enemy);
        }
      },
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.playerLasers,
      this.enemies,
      (this.increasingScore = (playerLaser, enemy) => {
        const enemyKey = enemy.body.gameObject.texture.key;
        if (enemyKey === 'enemy' || enemyKey === 'chaserEnemy') {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }
          this.player.score += 5;
          scoreDiv.innerHTML = `SCORE: ${this.player.score}`;
          enemy.disableBody(true, true);
          playerLaser.destroy();
        } else {
          enemy.health -= 1;
          playerLaser.destroy();
          if (enemy.health === 0) {
            if (enemy.onDestroy !== undefined) {
              enemy.onDestroy();
            }
            this.player.score += 10;
            scoreDiv.innerHTML = `SCORE: ${this.player.score}`;
            enemy.disableBody(true, true);
          }
        }
      }),
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      (this.anony = (player, enemy) => {
        if (!player.getData('isDead') && !enemy.getData('isDead')) {
          player.explode(false);
          enemy.explode(true);
          explosionSound.play();
          sfx.stop();
          setScore(this.player.name, this.player.score);
          setTimeout(() => {
            this.scene.start('SceneGameOver');
          }, 1000);
        }
      }),
    );

    this.physics.add.overlap(
      this.player,
      this.enemyLasers,
      (this.anotherAnony = (player, laser) => {
        if (!player.getData('isDead') && !laser.getData('isDead')) {
          player.explode(false);
          laser.destroy();
          explosionSound.play();
          sfx.stop();
          setScore(this.player.name, this.player.score);
          setTimeout(() => {
            this.scene.start('SceneGameOver');
          }, 1000);
        }
      }),
    );
  }

  update() {
    this.player.update();

    if (!this.player.getData('isDead')) {
      this.player.update();

      if (this.cursors.right.isUp) {
        this.player.anims.play('turn', true);
      } else if (this.cursors.left.isUp) {
        this.player.anims.play('turn', true);
      }

      if (this.cursors.up.isDown) {
        this.player.moveUp();
        this.player.anims.play('turn', true);
      } else if (this.cursors.down.isDown) {
        this.player.moveDown();
        this.player.anims.play('turn', true);
      }
      if (this.cursors.left.isDown) {
        this.player.moveLeft();
        this.player.anims.play('left', true);
      } else if (this.cursors.right.isDown) {
        this.player.moveRight();
        this.player.anims.play('right', true);
      }

      if (this.keySpace.isDown) {
        this.player.setData('isShooting', true);
      } else {
        this.player.setData(
          'timerShootTick',
          this.player.getData('timerShootDelay') - 1,
        );
        this.player.setData('isShooting', false);
      }
    }

    this.enemies.getChildren().forEach(enemy => {
      enemy.update();
      if (
        enemy.x < -enemy.displayWidth
        || enemy.x > this.game.config.width + enemy.displayWidth
        || enemy.y < -enemy.displayHeight * 4
        || enemy.y > this.game.config.height + enemy.displayHeight
      ) {
        if (enemy) {
          if (enemy.onDestroy !== undefined) {
            enemy.onDestroy();
          }

          enemy.destroy();
        }
      }
    });

    this.enemyLasers.getChildren().forEach(laser => {
      laser.update();
      if (
        laser.x < -laser.displayWidth
        || laser.x > this.game.config.width + laser.displayWidth
        || laser.y < -laser.displayHeight * 4
        || laser.y > this.game.config.height + laser.displayHeight
      ) {
        if (laser) {
          laser.destroy();
        }
      }
    });

    this.playerLasers.getChildren().forEach(laser => {
      laser.update();
      if (
        laser.x < -laser.displayWidth
        || laser.x > this.game.config.width + laser.displayWidth
        || laser.y < -laser.displayHeight * 4
        || laser.y > this.game.config.height + laser.displayHeight
      ) {
        if (laser) {
          laser.destroy();
        }
      }
    });

    this.backgrounds.forEach(bg => bg.update());
  }

  getEnemiesByType(type) {
    const enemiesArray = this.enemies
      .getChildren()
      .filter(enemy => enemy.getData('type') === type);
    return enemiesArray;
  }
}