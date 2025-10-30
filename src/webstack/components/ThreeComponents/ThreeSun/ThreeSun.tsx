import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Represents an advanced Sun element in a Three.js scene.
 * It creates a glowing sphere, a point light source, and an optional glow effect.
 */
export class ThreeSun {
    public group: THREE.Group; // Group to hold the sun mesh and light
    public mesh: THREE.Mesh;
    public light: THREE.PointLight;
    public glowSprite?: THREE.Sprite; // Optional sprite for glow effect

    private radius: number;
    private segments: number;
    private color: THREE.ColorRepresentation;
    private intensity: number;
    private hasGlow: boolean;
    private glowScale: number;

    /**
     * Creates an instance of SunComponent.
     * @param radius The radius of the sun sphere.
     * @param segments The number of segments for the sphere geometry (controls smoothness).
     * @param color The color of the sun's emissive light and point light.
     * @param intensity The intensity of the point light.
     * @param hasGlow Whether to add a glow effect.
     * @param glowScale The scaling factor for the glow effect.
     */
    constructor(
        radius: number = 10,
        segments: number = 32,
        color: THREE.ColorRepresentation = 0xFFA500, // Default to orange
        intensity: number = 1,
        hasGlow: boolean = true,
        glowScale: number = 2.5
    ) {
        this.radius = radius;
        this.segments = segments;
        this.color = color;
        this.intensity = intensity;
        this.hasGlow = hasGlow;
        this.glowScale = glowScale;

        this.group = new THREE.Group(); // Initialize the group

        // 1. Create the Sun Sphere Mesh
        const geometry = new THREE.SphereGeometry(this.radius, this.segments, this.segments);
        // SURGICAL FIX: Using MeshStandardMaterial to allow for emissive properties
        // The sphere itself will now appear to emit light.
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.color).multiplyScalar(0.2), // Base color (less prominent if primarily emissive)
            emissive: new THREE.Color(this.color), // The color that the material emits
            emissiveIntensity: 1, // How strong the emissive light is
            metalness: 0,
            roughness: 1 // Gaseous body-like appearance
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.group.add(this.mesh); // Add mesh to the group

        // 2. Create the Point Light Source
        // This light actually illuminates *other* objects in the scene.
        this.light = new THREE.PointLight(new THREE.Color(this.color), this.intensity, 0, 2);
        this.group.add(this.light); // Add light to the group

        // 3. Create the Glow Effect (optional)
        if (this.hasGlow) {
            this.createGlowEffect();
        }
    }

    /**
     * Creates a simple glow effect using a Sprite.
     * This method requires a texture for the glow. For a quick start,
     * you might use a blurred circle image or generate one dynamically.
     */
    private createGlowEffect(): void {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width / 2
            );
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        const glowTexture = new THREE.CanvasTexture(canvas);

        const spriteMaterial = new THREE.SpriteMaterial({
            map: glowTexture,
            color: new THREE.Color(this.color),
            transparent: true,
            blending: THREE.AdditiveBlending // Makes the glow additive
        });

        this.glowSprite = new THREE.Sprite(spriteMaterial);
        this.glowSprite.scale.set(this.radius * this.glowScale, this.radius * this.glowScale, 1);
        this.group.add(this.glowSprite); // Add glow sprite to the group
    }

    /**
     * Adds the sun's group (mesh, light, and glow) to a given Three.js scene.
     * @param scene The Three.js scene to add the sun to.
     */
    addToScene(scene: THREE.Scene): void {
        scene.add(this.group);
    }

    /**
     * Sets the position of the entire sun component (mesh, light, and glow).
     * @param x The x-coordinate.
     * @param y The y-coordinate.
     * @param z The z-coordinate.
     */
    setPosition(x: number, y: number, z: number): void {
        this.group.position.set(x, y, z);
    }

    /**
     * Updates the sun's light intensity.
     * @param newIntensity The new intensity for the point light.
     */
    setIntensity(newIntensity: number): void {
        this.light.intensity = newIntensity;
    }

    /**
     * Updates the sun's color. This will affect the sphere, light, and glow.
     * @param newColor The new color for the sun.
     */
    setColor(newColor: THREE.ColorRepresentation): void {
        const colorObject = new THREE.Color(newColor);

        // Update mesh material color and emissive properties
        (this.mesh.material as THREE.MeshStandardMaterial).color.copy(colorObject).multiplyScalar(0.2);
        (this.mesh.material as THREE.MeshStandardMaterial).emissive.copy(colorObject);

        // Update light color
        this.light.color.copy(colorObject);

        // Update glow sprite color if it exists
        if (this.glowSprite) {
            (this.glowSprite.material as THREE.SpriteMaterial).color.copy(colorObject);
        }
    }

    /**
     * Updates the glow effect's scale.
     * @param newGlowScale The new scaling factor for the glow effect.
     */
    setGlowScale(newGlowScale: number): void {
        this.glowScale = newGlowScale;
        if (this.glowSprite) {
            this.glowSprite.scale.set(this.radius * this.glowScale, this.radius * this.glowScale, 1);
        }
    }

    /**
     * Removes the sun component from its parent scene.
     */
    removeFromScene(): void {
        if (this.group.parent) {
            this.group.parent.remove(this.group);
        }
    }

    /**
     * Disposes of the sun component's resources (geometries, materials, textures).
     */
    dispose(): void {
        this.mesh.geometry.dispose();
        (this.mesh.material as THREE.MeshStandardMaterial).dispose();
        if (this.glowSprite) {
            (this.glowSprite.material as THREE.SpriteMaterial).map?.dispose();
            (this.glowSprite.material as THREE.SpriteMaterial).dispose();
        }
    }
}
// ThreeSunViewer.tsx

interface ThreeSunViewerProps {
    sunRadius?: number;
    sunSegments?: number;
    sunColor?: THREE.ColorRepresentation;
    sunIntensity?: number;
    hasGlow?: boolean;
    glowScale?: number;
    cameraPosition?: THREE.Vector3;
    orbitControl?: boolean; // Optional: to add orbit controls for interaction
}

const ThreeSunViewer: React.FC<ThreeSunViewerProps> = ({
    sunRadius = 10,
    sunSegments = 32,
    sunColor = 0xFFA500,
    sunIntensity = 1,
    hasGlow = true,
    glowScale = 2.5,
    cameraPosition = new THREE.Vector3(0, 50, 100),
    orbitControl = false // Default to no orbit controls
}) => {
    const mountRef = useRef<HTMLDivElement>(null); // Reference to the DOM element for the renderer
    const sunComponentRef = useRef<ThreeSun | null>(null); // Reference to the SunComponent instance

    useEffect(() => {
        if (!mountRef.current) return;

        // 1. Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Optional: OrbitControls (you'll need to install 'three-stdlib' or 'three/examples/jsm/controls/OrbitControls')
        let controls: any; // Using 'any' to avoid installing OrbitControls if not strictly needed for this example
        if (orbitControl) {
            // If you have OrbitControls installed:
            // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
            // controls = new OrbitControls(camera, renderer.domElement);
            // controls.enableDamping = true;
            // controls.dampingFactor = 0.25;
            // controls.screenSpacePanning = false;
            // controls.maxPolarAngle = Math.PI / 2;
            console.warn("OrbitControls requested but not imported. Please install 'three-stdlib' and import OrbitControls.");
        }

        // 2. Create the SunComponent instance
        const sun = new ThreeSun(sunRadius, sunSegments, sunColor, sunIntensity, hasGlow, glowScale);
        sun.setPosition(0, 0, 0); // Position the sun at the origin of the scene
        sun.addToScene(scene);
        sunComponentRef.current = sun; // Store reference to update later if needed

        // Optional: Add an ambient light to softly illuminate other potential objects in the scene
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // soft white light
        scene.add(ambientLight);

        // Optional: Add a simple object to demonstrate the sun's illumination
        const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x0000FF, roughness: 0.5, metalness: 0.1 });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(20, 0, 0);
        scene.add(box);

        // Set initial camera position
        camera.position.copy(cameraPosition);
        camera.lookAt(0, 0, 0);

        // 3. Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Update controls if enabled
            if (controls) controls.update();

            // Rotate the box to show it's illuminated
            box.rotation.x += 0.005;
            box.rotation.y += 0.005;

            renderer.render(scene, camera);
        };
        animate();

        // 4. Handle window resizing
        const handleResize = () => {
            if (mountRef.current) {
                camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // 5. Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            sun.removeFromScene();
            sun.dispose();
            renderer.dispose();
            // Dispose controls if they were created
            if (controls && controls.dispose) controls.dispose();
        };
    }, [sunRadius, sunSegments, sunColor, sunIntensity, hasGlow, glowScale, cameraPosition, orbitControl]); // Re-run effect if these props change

    // If you need to update SunComponent properties after initial render,
    // you would use another useEffect hook that watches for changes in props
    // and calls the appropriate `sunComponentRef.current` methods.
    useEffect(() => {
        if (sunComponentRef.current) {
            sunComponentRef.current.setColor(sunColor);
            sunComponentRef.current.setIntensity(sunIntensity);
            sunComponentRef.current.setGlowScale(glowScale);
            // Add other updates as needed
        }
    }, [sunColor, sunIntensity, glowScale]);


    return (
        <div
            ref={mountRef}
            style={{ width: '100vw', height: '500px', background: 'black' }} // Set dimensions and background
        />
    );
};

export default ThreeSunViewer;