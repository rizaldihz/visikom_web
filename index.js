async function init(img){
    model =  await tf.loadModel('tfjs_model/model.json');
    console.log('model loaded from storage');

    let result = preprocess(img);
    const pred = model.predict(result).dataSync();
    console.log(pred);
}

function preprocess(img)
{

    //convert the image data to a tensor 
    let tensor = tf.fromPixels(img)
    //resize to 50 X 50
    const resized = tf.image.resizeBilinear(tensor, [224, 224]).toFloat()
    // Normalize the image 
    const offset = tf.scalar(255.0);
    const normalized = tf.scalar(1.0).sub(resized.div(offset));
    //We add a dimension to get a batch shape 
    const batched = normalized.expandDims(0)
    return batched

}