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