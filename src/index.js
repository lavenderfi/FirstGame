import Phaser from 'phaser';
import brown from './Free/Background/Brown.png';
import star from './assets/star.png';
import pinkman from './Free/Main Characters/Pink Man/Idle.png';
import pinkmanrun from './Free/Main Characters/Pink Man/Run.png'
import pinkmanrunleft from './Free/Main Characters/Pink Man/Runleft.png'
import block from './Free/Terrain/Block.png'
import spikes from './Free/Traps/Spiked Ball/Spiked Ball.png'

let movingPlatform;

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('brown', brown);
    this.load.image('star', star);
    this.load.image('block',block)
    this.load.image('spikes',spikes)
    this.load.spritesheet('pinkman', pinkman, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('pinkmanrun', pinkmanrun, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('pinkmanrunleft', pinkmanrunleft, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
   this.add.tileSprite(400, 200, 800, 700, 'brown');
// platforms
    const blocks = this.physics.add.staticGroup()
    blocks.create(400,400,'block')
    blocks.create(447,400,'block')
    blocks.create(494,400,'block')
    blocks.create(70,380,'block')
    blocks.create(117,380,'block')
    blocks.create(250,100,'block')
    blocks.create(650,100,'block')
    blocks.create(694,100,'block')
    blocks.create(600,200,'block')
    blocks.create(350,200,'block')

     movingPlatform = this.physics.add.image(300, 300, 'block');

    movingPlatform.setImmovable(true);
    movingPlatform.body.allowGravity = false;
    movingPlatform.setVelocityX(50);


    //ground lol
    blocks.create(50, 568, 'block').setScale(2).refreshBody();
    blocks.create(145, 568, 'block').setScale(2).refreshBody();
    blocks.create(240, 568, 'block').setScale(2).refreshBody();
    blocks.create(335, 568, 'block').setScale(2).refreshBody();
    blocks.create(430, 568, 'block').setScale(2).refreshBody();
    blocks.create(525, 568, 'block').setScale(2).refreshBody();
    blocks.create(620, 568, 'block').setScale(2).refreshBody();
    blocks.create(715, 568, 'block').setScale(2).refreshBody();
    blocks.create(810, 568, 'block').setScale(2).refreshBody();

// player
    this.player = this.physics.add.sprite(150, 450, 'pinkman');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, blocks);
// anims
    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('pinkman', { start: 0, end: 10 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('pinkmanrun', { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('pinkmanrunleft', { start: 0, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    
// stars
    const stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    this.physics.add.collider(stars, blocks);;
    this.physics.add.overlap(this.player, stars, collect, null, this);


// collect
    let score = 0;
    function collect(player, star) {
      star.disableBody(true, true);
      score += 1;
      scoreText.setText('score:' + score);

      if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
          child.enableBody(true, child.x, 0, true, true);
        });

        var x =
          player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        const spike = spikes.create(x, 16, 'spikes');
        spike.setBounce(1);
        spike.setCollideWorldBounds(true);
        spike.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
}
// score
      const scoreText = this.add.text(15, 15, 'score:0', {
        fontSize: '32px',
        fill: '#000',
      });
// spikes
      const spikes = this.physics.add.group();
      this.physics.add.collider(spikes, blocks);
      this.physics.add.collider(this.player, spikes, spikeTouched, null, this);
      this.physics.add.collider(stars, movingPlatform);
      this.physics.add.collider(this.player, movingPlatform);
      this.physics.add.collider(spikes, movingPlatform);

      function spikeTouched() {
        this.physics.pause();
        this.player.setTint(0xff000);
        this.player.anims.play('turn');
        this.add.text(350,300, 'GAME OVER',{
          fontSize:'45px',
          fill:'#000'
        })
      }
  }
  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn',true);
    }
    if (movingPlatform.x >= 500)
    {
        movingPlatform.setVelocityX(-50);
    }
    else if (movingPlatform.x <= 300)
    {
        movingPlatform.setVelocityX(50);
    }

    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-417);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 550,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: MyGame,
};

const game = new Phaser.Game(config);
