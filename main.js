var router = new VueRouter();

var mainComponent = Vue.extend({
	components: {
		'bill-component': billComponent
	},
	template: '<bill-component></bill-component>',
	data: function() {
		return {
			billsPay: [
	            {date_due: '20/08/2016', name: 'Conta de Luz', value: 25.99, done: true},
	            {date_due: '20/09/2016', name: 'Conta de Água', value: 30.99, done: true},
	            {date_due: '20/10/2016', name: 'Conta de Internet', value: 35.99, done: false},
	            {date_due: '20/11/2016', name: 'Conta de Telefone', value: 40.99, done: false},
	            {date_due: '20/12/2016', name: 'Conta de Condominio', value: 45.99, done: false}
	        ]
		};
	}
});

router.map({
	'/bill-pays': {
		component: billPayComponent,
		subRoutes: {
			'/': {
				name: 'bill-pay.list', 
				component: billPayListComponent
			},
			'/create': {
				name: 'bill-pay.create',
				component: billPayCreateComponent
			},
			'/:index/update': {
				name: 'bill-pay.update',
				component: billPayCreateComponent
			}
		}
	},
	'*': {
		component: billPayListComponent
	},
	'bill-receives': {
		name: 'bill-receive',
		component: billReceiveComponent
	}
});

router.start({
	components: {
		'main-component': mainComponent
	}
}, '#app');

router.redirect({
	'*': '/bill-pays'
});