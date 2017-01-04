Vue.filter('doneLabel', function(value) {
    if(value == 0) {
        return "Não";
    } else {
        return "Sim";
    }
});

Vue.filter('statusGeneral', function(value) {
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
});

var menuComponent = Vue.extend({
	template: `
		<nav>
			<ul>
				<li v-for="menu in menus">
					<a @click.prevent="showView(menu.id)" style="cursor:pointer">{{ menu.name }}</a>
				</li>
			</ul>
		</nav>
	`,
	data: function() {
		return {
	        menus: [
	            {id: 0, name: "Listar Contas"}, 
	            {id: 1, name: "Criar Conta"}
	        ]
		}
	},
	methods: {
		showView: function(id) {
			this.$dispatch('change-activedview', id);
            if (id == 1) {
                this.$dispatch('change-formtype', 'insert');
            }
        }
	}
});

var billListComponent = Vue.extend({
	template: `
		<style type="text/css">
			.pago {
				color: green;
			}
			.nao-pago {
				color: red;
			}
		</style>

		<table border="1" cellpadding="10">
			<thead>
				<tr>
					<td></td>
					<td>Vencimento</td>
					<td>Nome</td>
					<td>Valor</td>
					<td>Paga?</td>
					<td>Ações</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(index, bill) in bills">
					<td>{{ index + 1 }}</td>
					<td>{{ bill.date_due }}</td>
					<td>{{ bill.name }}</td>
					<td>{{ bill.value | currency 'R$ ' 2}}</td>
					<td :class="{'pago': bill.done, 'nao-pago': !bill.done}">
						{{ bill.done | doneLabel }}
					</td>
					<td style="cursor:pointer">
						<a @click.prevent="loadBill(bill)">Editar</a> |
						<a @click.prevent="removeBill(bill)">Remover</a>
					</td>
				</tr>
			</tbody>
		</table>
	`,
	data: function() {
		return {
			bills: [
	            {date_due: '20/08/2016', name: 'Conta de Luz', value: 25.99, done: true},
	            {date_due: '20/09/2016', name: 'Conta de Água', value: 30.99, done: true},
	            {date_due: '20/10/2016', name: 'Conta de Internet', value: 35.99, done: false},
	            {date_due: '20/11/2016', name: 'Conta de Telefone', value: 40.99, done: false},
	            {date_due: '20/12/2016', name: 'Conta de Condominio', value: 45.99, done: false}
	        ]
		}
	},
	methods: {
        loadBill: function(bill) {
            this.$dispatch('change-bill', bill);
            this.$dispatch('change-activedview', 1);
            this.$dispatch('change-formtype', 'update');
        },
        removeBill : function(bill) {
            if (confirm('Deseja excluir esta conta?')) {
                this.bills.$remove(bill);
            }            
        }
	},
    'new-bill': function(bill) {
		this.bills.push(bill);
	}
});

var billCreateComponent = Vue.extend({
	template: `
		<form name="form" @submit.prevent="submit">
			<label>Vencimento:</label>
			<input type="text" v-model="bill.date_due">
			<br><br>

			<label>Nome:</label>
			<select v-model="bill.name">
				<option v-for="name in names" :value=" name">{{ name }}</option>
			</select>
			<br><br>

			<label>Valor:</label>
			<input type="text" v-model="bill.value">
			<br><br>
			
			<label>Pago?</label>
			<input type="checkbox" v-model="bill.done">
			<br><br>

			<input type="submit" value="Enviar">
		</form>
	`,
	data: function() {
		return {
			formType: 'insert',
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
	        bill: {
	            date_due: '',
	            name: '',
	            value: 0,
	            done: false
	        }
		}
	},
	methods: {
		submit: function() {
            if (this.formType == 'insert') {
                this.$dispatch('new-bill', this.bill);
            }

            this.bill = {
                            date_due: '',
                            name: '',
                            value: 0,
                            done: false
                        };

            this.$dispatch('change-activedview', 0);
        }
	},
	events: {
    	'change-formtype': function(formType) {
    		this.formType = formType
    	},
    	'change-bill': function(bill) {
    		this.bill = bill;
    	},
    }
});

var appComponent = Vue.extend({
	components: {
		'menu-component': menuComponent,
		'bill-list-component': billListComponent,
		'bill-create-component': billCreateComponent
	},
   	template: `
   		<style type="text/css">
			.red {
				color: red;
			}

			.green {
				color: green;
			}

			.gray {
				color: gray;
			}
		</style>

		<h1>{{ title }}</h1>
		<h3 :class="{'gray': status === false, 'green': status === 0, 'red' : status > 0}">
			{{ status | statusGeneral }}
		</h3>
		
		<menu-component></menu-component>

		<div v-show="activedView == 0">
			<bill-list-component v-ref:bill-list-component></bill-list-component>
		</div>

		<div v-show="activedView == 1">
			<bill-create-component :bill.sync="bill"></bill-create-component>
		</div>
	`,
    data: function() { 
    	return {
	        title: "Contas a Pagar",
	        activedView: 0
	    };
	},
    computed: {
        status: function() {
        	var billListComponent = this.$refs.billListComponent;
            if(!billListComponent.bills.length) {
                return false;
            }

            var count = 0;
            for (var i in billListComponent.bills) {
                if (!billListComponent.bills[i].done) {
                    count++;
                }                
            }

            return count;
        }
    },
    methods: {},
    events: {
    	'change-activedview': function(activedView) {
    		this.activedView = activedView;
    	},
    	'change-formtype': function(formType) {
    		this.$broadcast('change-formtype', formType);
    	},
    	'change-bill': function(bill) {
    		this.$broadcast('change-bill', bill);
    	}, 
    	'new-bill': function(bill) {
    		this.$broadcast('new-bill', bill);
    	}
    }
});

Vue.component('app-component', appComponent); 

var app = new Vue({
    el: "#app"
});
