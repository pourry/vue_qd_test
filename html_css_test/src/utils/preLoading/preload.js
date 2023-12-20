import {getSm2} from '../../api/login'

function loadingSm2(){
    getSm2().then(res=>{
        console.log(res)
    })
}
export {
    loadingSm2
}