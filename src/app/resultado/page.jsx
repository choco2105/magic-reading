<button
  onClick={() => {
    limpiarCuento(); // Limpiar antes de navegar
    router.push('/');
  }}
  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
>
  📚 Leer otro cuento
</button>