
Sortable.create(CONTENEDOR_NOTAS,{
    filter:'.eliminar',
    animation: 200,
    chosenClass: "notaSeleccionada",
    ghostClass: "notaFantasma",
    forceFallback: true,
    fallbackClass: "notaClon",
	fallbackTolerance: 2,
	group: "ordenNotas",
	store: {
		set:(sortable) => {
			let order = sortable.toArray();
			localStorage.setItem(sortable.options.group.name, order.join('|'));
		}
	}
})
