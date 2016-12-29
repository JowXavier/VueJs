var app = new Vue({
    el: "#app",
    data: {
        title: "Contas a Pagar",
        menus: [
            {id: 0, name: "Listar Contas"}, 
            {id: 1, name: "Criar Conta"}
        ],
        activedView: 0,
        formType: 'insert',
        bill: {
            date_due: '',
            name: '',
            value: 0,
            done: false
        },
        names: [
            'Conta de Luz',
            'Conta de Água',
            'Conta de Internet',
            'Conta de Telefone',
            'Conta de Condominio',
            'Gasolina',
            'Refeição',
            'Supermercado'
        ],
        bills: [
            {date_due: '20/08/2016', name: 'Conta de Luz', value: 25.99, done: true},
            {date_due: '20/09/2016', name: 'Conta de Água', value: 30.99, done: true},
            {date_due: '20/10/2016', name: 'Conta de Internet', value: 35.99, done: false},
            {date_due: '20/11/2016', name: 'Conta de Telefone', value: 40.99, done: false},
            {date_due: '20/12/2016', name: 'Conta de Condominio', value: 45.99, done: false}
        ]
    },
    computed: {
        status: function() {
            if(!this.bills.length) {
                return false;
            }

            var count = 0;
            for (var i in this.bills) {
                if (!this.bills[i].done) {
                    count++;
                }                
            }

            return count;
        }
    },
    methods: {
        showView: function(id) {
            this.activedView = id;
            if (id == 1) {
                this.formType = 'insert';
            }
        },
        submit: function() {

            if (this.formType == 'insert') {
                this.bills.push(this.bill);
            }

            this.bill = {
                            date_due: '',
                            name: '',
                            value: 0,
                            done: false
                        };

            this.activedView = 0;
        },
        loadBill: function(bill) {
            this.bill = bill;
            this.activedView = 1;
            this.formType = 'update';
        },
        removeBill : function(bill) {
            if (confirm('Deseja excluir esta conta?')) {
                this.bills.$remove(bill);
            }            
        }
    },
    filters: {
        doneLabel: function (value) {
            if(value == 0) {
                return "Não";
            }else {
                return "Sim";
            }
        },
        statusGeneral: function (value) { console.log(value);
            if(value === false) {
                return "Nenhuma conta cadastrada";
            }

            if(!value){
                return "Nenhuma conta a pagar";
            } else {
                if (value > 1) {
                    return "Existem " + value + " contas a serem pagas";        
                } else {
                    return "Existe " + value + " conta a ser paga";
                }                
            }
        }
    }
});
