document.addEventListener('DOMContentLoaded', () => {
    
    const productForm = document.getElementById('productForm');
    const nomeInput = document.getElementById('nome');
    const qtdInput = document.getElementById('qtd');
    const valorInput = document.getElementById('valor');
    const listContainer = document.getElementById('listContainer');
    const toastContainer = document.getElementById('toast-container');

    
    let products = JSON.parse(localStorage.getItem('electronicProducts')) || [];
    renderProducts();

   
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const qtd = parseInt(qtdInput.value);
        const valor = parseFloat(valorInput.value);

        if (!nome || isNaN(qtd) || isNaN(valor) || qtd <= 0 || valor <= 0) {
            showToast('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }

        const newProduct = {
            id: Date.now(),
            nome: nome,
            qtd: qtd,
            valor: valor
        };

        products.push(newProduct);
        saveProducts();

        renderProducts();
        showToast('Produto cadastrado com sucesso!', 'success');

        productForm.reset();
        nomeInput.focus();
    });

  
    function renderProducts() {
        listContainer.innerHTML = '';

        if (products.length === 0) {
            listContainer.innerHTML = '<p class="empty-list">Nenhum produto cadastrado ainda.</p>';
            return;
        }

        products.sort((a, b) => b.id - a.id);

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card glass';
            card.innerHTML = `
                <button class="delete-btn" onclick="deleteProduct(${product.id})" title="Excluir Produto">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <h3>${product.nome}</h3>
                <p><strong>Quantidade:</strong> ${product.qtd}</p>
                <p><strong>Valor Unitário:</strong> ${formatCurrency(product.valor)}</p>
                <p><strong>Valor Total:</strong> ${formatCurrency(product.qtd * product.valor)}</p>
            `;
            listContainer.appendChild(card);
        });
    }

    window.deleteProduct = function(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            products = products.filter(p => p.id !== id);
            saveProducts();
            renderProducts();
            showToast('Produto excluído com sucesso!', 'success');
        }
    };

   
    function saveProducts() {
        localStorage.setItem('electronicProducts', JSON.stringify(products));
    }


    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;

        toastContainer.appendChild(toast);

       
        setTimeout(() => toast.classList.add('show'), 10);

        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); 
        }, 3500);
    }
// comentario de tesete
 
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
});