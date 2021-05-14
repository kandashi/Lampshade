
import { libWrapper } from './shim.js';
Hooks.once('init', async function() {
    if(isNewerVersion(game.data.version, "0.8.3")) {
        libWrapper.register('lampshade', 'Token.prototype.updateSource', newSource, 'OVERRIDE')
    }
    else {
        libWrapper.register('lampshade', 'Token.prototype.updateSource', newSource79, 'OVERRIDE')
    }
});

function newSource({defer=false, deleted=false, noUpdateFog=false}={}) {
    {
        if ( CONFIG.debug.sight ) {
          SightLayer._performance = { start: performance.now(), tests: 0, rays: 0 }
        }
    
        // Prepare some common data
        const origin = this.getSightOrigin();
        const sourceId = this.sourceId;
        const d = canvas.dimensions;
    
        // Update light source
        const isLightSource = this.emitsLight && !this.data.hidden;
        if ( isLightSource && !deleted ) {
          const bright = Math.min(this.getLightRadius(this.data.brightLight), d.maxR);
          const dim = Math.min(this.getLightRadius(this.data.dimLight), d.maxR);
          this.light.initialize({
            x: origin.x,
            y: origin.y,
            dim: dim,
            bright: bright,
            angle: this.data.lightAngle,
            rotation: this.data.rotation,
            color: this.data.lightColor,
            alpha: this.data.lightAlpha,
            animation: this.data.lightAnimation
          });
          canvas.lighting.sources.set(sourceId, this.light);
          if ( !defer ) {
            this.light.drawLight();
            this.light.drawColor();
          }
        }
        else {
          canvas.lighting.sources.delete(sourceId);
          if ( isLightSource && !defer ) canvas.lighting.refresh();
        }
    
        // Update vision source
        const isVisionSource = this._isVisionSource();
        if ( isVisionSource && !deleted ) {
          let dim = Math.min(this.getLightRadius(this.data.dimSight), d.maxR);
          const bright = Math.min(this.getLightRadius(this.data.brightSight), d.maxR);
               let x = Math.toRadians(this.data.rotation-90)
               let y = this.w/2
          this.vision.initialize({
            x: origin.x + Math.cos(x)*y,
            y: origin.y + Math.sin(x)*y,
            dim: dim,
            bright: bright,
            angle: this.data.sightAngle,
            rotation: this.data.rotation
          });
          canvas.sight.sources.set(sourceId, this.vision);
          if ( !defer ) {
            this.vision.drawLight();
            canvas.sight.refresh({noUpdateFog});
          }
        }
        else {
          canvas.sight.sources.delete(sourceId);
          if ( isVisionSource && !defer ) canvas.sight.refresh();
        }
      }
}

function newSource79({defer=false, deleted=false, noUpdateFog=false}={}) {
    if ( CONFIG.debug.sight ) {
      SightLayer._performance = { start: performance.now(), tests: 0, rays: 0 }
    }

    // Prepare some common data
    const origin = this.getSightOrigin();
    const sourceId = this.sourceId;
    const d = canvas.dimensions;
    const maxR = Math.hypot(d.sceneWidth, d.sceneHeight);

    // Update light source
    const isLightSource = this.emitsLight && !this.data.hidden;
    if ( isLightSource && !deleted ) {
      const bright = Math.min(this.getLightRadius(this.data.brightLight), maxR);
      const dim = Math.min(this.getLightRadius(this.data.dimLight), maxR);
      this.light.initialize({
        x: origin.x,
        y: origin.y,
        dim: dim,
        bright: bright,
        angle: this.data.lightAngle,
        rotation: this.data.rotation,
        color: this.data.lightColor,
        alpha: this.data.lightAlpha,
        animation: this.data.lightAnimation
      });
      canvas.lighting.sources.set(sourceId, this.light);
      if ( !defer ) {
        this.light.drawLight();
        this.light.drawColor();
      }
    }
    else {
      canvas.lighting.sources.delete(sourceId);
      if ( isLightSource && !defer ) canvas.lighting.refresh();
    }
     // Update vision source
     const isVisionSource = this._isVisionSource();
     if ( isVisionSource && !deleted ) {
       let dim =  canvas.lighting.globalLight ? maxR : Math.min(this.getLightRadius(this.data.dimSight), maxR);
       const bright = Math.min(this.getLightRadius(this.data.brightSight), maxR);
       if ((dim === 0) && (bright === 0)) dim = Math.min(this.w, this.h) * 0.5;
       let x = Math.toRadians(this.data.rotation-90)
               let y = this.w/2
          this.vision.initialize({
            x: origin.x + Math.cos(x)*y,
            y: origin.y + Math.sin(x)*y,
            dim: dim,
         bright: bright,
         angle: this.data.sightAngle,
         rotation: this.data.rotation
       });
       canvas.sight.sources.set(sourceId, this.vision);
       if ( !defer ) {
         this.vision.drawLight();
         canvas.sight.refresh({noUpdateFog});
       }
     }
     else {
       canvas.sight.sources.delete(sourceId);
       if ( isVisionSource && !defer ) canvas.sight.refresh();
     }
   }