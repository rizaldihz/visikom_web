
let classes;
let detailsJSON;
let model = null;

readTextFile('file:///D:/KULIAH/SEMESTER 5/VISI KOMPUTER/FINAL PROJECT/visikom_web/class.txt')

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                classes = allText.split('\n')
            }
        }
    }
    rawFile.send(null);
}

function requestUpdateDetails(cls)
{
    file = 'file:///D:/KULIAH/SEMESTER 5/VISI KOMPUTER/FINAL PROJECT/visikom_web/Informasi/' + cls + '.json';
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                detailsJSON = rawFile.responseText;
                const details = JSON.parse(detailsJSON)
                updateDetails(details);
            }
        }
    }
    rawFile.send(null);
}

function updateDetails(details){
    $('#details').html( `
        <table>
            <tbody>
                <tr>
                    <td>
                        Bahan:
                    </td>
                    <td>`
                    + details.bahan + 
                    `
                </tr>
                <tr>
                    <td>
                        Cara Pembuatan:
                    </td>
                    <td>`
                    + details.cara_pembuatan + 
                    `
                </tr>
                <tr>
                    <td>
                        Tempat Rekomendasi:
                    </td>
                    <td>`
                    + details.rekomendasi.toko + '<br>' + details.rekomendasi.alamat +
                    `
                </tr>
            </tbody>
        </table>
    `
        );
}

async function init(img){
    if(model===null){
        model =  await tf.loadModel('tfjs_model/model.json');
        console.log('model loaded from storage');
    }
    let result = preprocess(img);
    const pred = model.predict(result).dataSync();
    let cls = getClass(pred);
    $('#output').text(classes[cls.idx] + ' ' + (cls.conf*100).toFixed(2) + '%');
    requestUpdateDetails(classes[cls.idx]);
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

function getClass(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return {'idx' : maxIndex, 'conf' : max};
}