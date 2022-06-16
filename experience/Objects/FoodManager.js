import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import foodsData from '../data/foodsData';
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { MathUtils, Vector2 } from 'three';
import TWEEN from 'tween.js';

export default class FoodManager {

    constructor(sceneView) {  
        this.sceneView = sceneView
        this.foods = []
        this.tweens = []
        this.eyes = []
    }

    load() {
        const loader = new GLTFLoader();
        loader.load( '/assets/food/scene.gltf', ( gltf ) => {
            this.ressources = gltf.scene    
            this.setup()
        }, undefined, function ( error ) {
            console.error( error );
        } );
    }

    setup () {
        foodsData.forEach(food => this.addFood(food.name, food.position, food.scale, food.rotation))
        this.handleDrag()
        this.movingEyes()  
        console.log(this.eyes)
    }

    addFood(name, position, scale, rotation) {
        const foodModel = this.ressources.getObjectByName(name).children[0] // Mesh

        if (!foodModel) {
            return false;
        }

        const food = foodModel.clone()

        this.foods.push(food)

        food.position.set(Math.random() * 60 - 30, Math.random() * 10 - 5, Math.random() * 60 - 30)
        food.scale.multiplyScalar(scale)
        food.rotation.set(MathUtils.degToRad(rotation.x), MathUtils.degToRad(rotation.y), MathUtils.degToRad(rotation.z))

        this.sceneView.scene.add(food)

        let tween
        tween = new TWEEN.Tween(food.position)
        tween.to(position, 2000)
        tween.easing(TWEEN.Easing.Exponential.In);
        // console.log(TWEEN.Easing)
        tween.start()
        // window.addEventListener('click', () => {
        //     tween.start()
        // })
        
        if (name === 'Avocado') {
            this.eyes.push({food, position})
        }
    }

    handleDrag() {
        const controls = new DragControls(this.foods, this.sceneView.camera, this.sceneView.renderer.domElement);

        controls.addEventListener('dragstart', (event) => {
            this.sceneView.controls.enabled = false
            // console.log(event.object)
        } );

        controls.addEventListener('drag', function(event){
            event.object.position.x = MathUtils.clamp(event.object.position.x, -50, 50);
            event.object.position.y = MathUtils.clamp(event.object.position.y, -20, 20);
            event.object.position.z = MathUtils.clamp(event.object.position.z, -50, 50);
        })
        
        controls.addEventListener('dragend', (event) => {
            this.sceneView.controls.enabled = true
            // this.getFoodPosition()
        } );
    }

    getFoodPosition() {
        this.foods.forEach((element, i) => {
            foodsData[i].position.x = element.position.x
            foodsData[i].position.y = element.position.y
            foodsData[i].position.z = element.position.z
        })
        console.log(JSON.stringify(foodsData))
    }

    movingEyes() {
        window.addEventListener( 'pointermove', this.onPointerMove.bind(this) );
    }

    onPointerMove(event) {
        const pointer = new Vector2();
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        this.eyes.forEach(element => {
            element.food.position.x = element.position.x + pointer.x
            element.food.position.z = element.position.z - pointer.y
        })
    }

}