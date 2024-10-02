window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = 'none';
    }, 500);
});

new Vue({
    el: '#app',
    data: {
        newCategory: '',
        newItem: [],
        categories: [],
        editedItem: [],
        filter: 'all'
    },
    computed: {
        filteredCategories() {
            return this.categories.map(category => {
                return {
                    ...category,
                    items: category.items.filter(item => {
                        if (this.filter === 'checked') return item.checked;
                        if (this.filter === 'unchecked') return !item.checked;
                        return true; // 'all'
                    })
                };
            });
        }
    },
    methods: {
        addCategory() {
            if (this.newCategory) {
                this.categories.push({ name: this.newCategory, items: [] });
                this.newItem.push('');
                this.editedItem.push([]);
                this.newCategory = '';
                this.saveToLocalStorage();
            }
        },
        addItem(categoryIndex) {
            if (this.newItem[categoryIndex]) {
                this.categories[categoryIndex].items.push({
                    name: this.newItem[categoryIndex],
                    checked: false,
                    isEditing: false
                });
                this.newItem[categoryIndex] = '';
                this.saveToLocalStorage();
            }
        },
        toggleCheck(categoryIndex, itemIndex) {
            const item = this.categories[categoryIndex].items[itemIndex];
            item.checked = !item.checked; // Toggle the checked state
            this.saveToLocalStorage(); // Save to local storage after toggling
        
            // Force Vue to reapply the filter by manually re-computing the filteredCategories
            this.$forceUpdate();
        },
        toggleEdit(categoryIndex, itemIndex) {
            const item = this.categories[categoryIndex].items[itemIndex];
            if (item.isEditing) {
                this.saveEdit(categoryIndex, itemIndex);
            } else {
                this.editedItem[categoryIndex][itemIndex] = item.name;
                item.isEditing = true;
            }
        },
        saveEdit(categoryIndex, itemIndex) {
            const item = this.categories[categoryIndex].items[itemIndex];
            item.name = this.editedItem[categoryIndex][itemIndex];
            item.isEditing = false;
            this.saveToLocalStorage();
        },
        deleteItem(categoryIndex, itemIndex) {
            this.categories[categoryIndex].items.splice(itemIndex, 1);
            this.saveToLocalStorage();
        },
        calculateProgress(categoryIndex) {
            const items = this.categories[categoryIndex].items;
            if (items.length === 0) return 0; // Avoid division by zero
            const checkedCount = items.filter(item => item.checked).length;
            return Math.round((checkedCount / items.length) * 100);
        },
        saveToLocalStorage() {
            localStorage.setItem('checklistCategories', JSON.stringify(this.categories));
        },
        loadFromLocalStorage() {
            const data = localStorage.getItem('checklistCategories');
            if (data) {
                this.categories = JSON.parse(data);
                this.newItem = Array(this.categories.length).fill('');
                this.editedItem = Array(this.categories.length).fill([]);
            }
        }
    },
    mounted() {
        this.loadFromLocalStorage(); // Load data when the app mounts
    }
});
