let table = document.getElementById('table')
const addBtn = document.getElementById('addBtn')
let data = []

let url = window.location.href.split('?')[0] + '?action=consumptionElements'
$.get(url, function (arry, status) {
    if (typeof arry.consumptionElements == 'undefined')
        return
    data = arry.consumptionElements
    displayTable(data)
});


addBtn.addEventListener('click', () => {
    const selected = document.getElementById('consumptionElement')

    let obj = {

        id: '',
        name: '',
        qty: 1
    }

    obj.id = selected.options[selected.selectedIndex].value
    if(!obj.id){
        alert('alert' , 'تحقق من أن جميع الحقول ممتلئة!')
        location.href = '#mainTitile'

        return
    }
    console.log(obj.id);
    obj.name = selected.options[selected.selectedIndex].text
    let exist = false
    data.map((item, index) => {
        if (item.id == obj.id) {
            data[index].qty++
            exist = true
            return
        }
    })

    if (exist) {
        displayTable(data)
        return

    }

    data.push(obj)
    displayTable(data)
    location.href = '#table'
})
const alert = (elementId, text) => {
    $(`#${elementId}`).html(`<div class="alert alert-warning alert-dismissible fade show" role="alert" > 
    <strong style="padding: 0 25px  0 5px ;"> خطأ!</strong>${text}  
    <button type="button" class="close" data-dismiss="alert" aria-label="Close"  >
    <span aria-hidden="true">&times;</span>
    </button>
    </div>`)
}

const btnClick = () => {
    if (data == false) {
       alert('alert' , 'تحقق من أن جميع الحقول ممتلئة!')
        location.href = '#mainTitile'
        return false
    }
    return true
}
$('#form1').on('submit', function () {

    $('#hidden_input').val(JSON.stringify(data));
});

const displayTable = (data) => {
    let temp = ''


    data.map((item, index) => {
        temp = temp + `
        <tr role="button" style=" cursor: pointer;" id="${index}">
        <td>عنصر : ${index + 1}</td>
        <td>${item.name}</td>
        <td id=${index} role='button' >${item.qty}</td>
        <td style="width:15%">
        <a class="btn" role="button" id="${index}"  onclick="showEditModel(this)">
        <i class="fas fa-pen"></i>
        </a>

        <a class="btn" role="button" id="${index}" onclick="deleteTableRow(this)">
            <i class="fas fa-minus-circle "></i>
        </a>
        </td>
        </tr>
        `
    })

    this.table.innerHTML = `
    <table class="table table-striped text-center table-bordered">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">العنصر</th>
                <th scope="col">العدد</th>
                <th scope="col">أدوات</th>

            </tr>
        </thead>
        <tbody>
          ${temp}
        </tbody>
    </table>
    <hr class="m-3">
    <style>
        td{
            padding:5px !important;
        }
        th{
            padding:6px !important;
        }
    </style>`

}

const deleteTableRow = (e) => {
    data.splice(parseInt(e.id), 1)
    displayTable(data)
    if (data == false)
        table.innerHTML = ''
}
/*
const minsItem = (e) => {
    data[e.id].qty--
    displayTable(data)
    if (data[e.id].qty <= 0)
        deleteTableRow(e)
}*/
let index2 = 0
const showEditModel = (e) => {
    const index = e.id
    index2 = index
    console.log(index);
    $('#editQtyInput').val(data[index].qty)
    $('#editModal').modal('toggle');
}
$('#editQtyBtn').on('click', () => {
    data[index2].qty = parseFloat($('#editQtyInput').val() || 0)
    $('#editModal').modal('toggle');

    displayTable(data)
})

/*
document.getElementById('editModal').addEventListener('click' , ()=>{


})**/