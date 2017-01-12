window.billPayListComponent = Vue.extend({
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
						<a v-link="{name: 'bill-pay.update', params: {index: index}}">Editar</a> |
						<a @click.prevent="removeBill(bill)">Remover</a>
					</td>
				</tr>
			</tbody>
		</table>
	`,
	data: function() {
		return {
			bills: this.$root.$children[0].billsPay
		}
	},
	methods: {
        removeBill : function(bill) {
            if (confirm('Deseja excluir esta conta?')) {
                this.$root.$children[0].billsPay.$remove(bill);
            }            
        }
	}
});