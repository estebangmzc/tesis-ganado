import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Si necesitas directivas comunes
import { FormsModule } from '@angular/forms';   // Importamos FormsModule para ngModel

@Component({
  selector: 'app-biblioteca',
  imports: [CommonModule, FormsModule],  // Importa los módulos necesarios
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.css'],
  standalone: true
})
export class BibliotecaComponent {
  // Variables para controlar la búsqueda y la categoría seleccionada
  busqueda: string = '';
  categoriaSeleccionada: string = '';
  isModalOpen = false;
  selectedTarjeta: any = null;

  // Datos de ejemplo, puedes conectar esto con Firebase en el futuro
  tarjetas = [
    {
      titulo: 'Holstein',
      descripcion: 'Raza lechera de alta productividad.',
      categoria: 'Razas',
      imagen: 'assets/fotos/Holstein.jpg',
      contenidoExtendido: `
    La Holstein es una raza bovina originaria de los Países Bajos, reconocida mundialmente por su elevada producción de leche. 
    Su característico pelaje blanco con manchas negras (o rojas en la variedad Red Holstein) y su gran tamaño la hacen fácilmente identificable.
    
    Una vaca Holstein en condiciones óptimas puede producir entre 25 y 35 litros de leche diarios, con un contenido promedio de grasa del 3.5% 
    y proteína del 3.1%. Sin embargo, esta raza tiene una menor longevidad productiva en comparación con otras razas 
    y puede ser más susceptible a enfermedades metabólicas como la cetosis o la hipocalcemia postparto.
    
    📌 Recomendaciones:
    - Requiere una dieta altamente energética y balanceada.
    - Es indispensable un control riguroso de la salud podal y reproductiva.
    - Ideal para sistemas de producción intensivos y mecanizados.
    
    💉 Vacunación sugerida:
    - Fiebre aftosa.
    - Brucelosis (revacunación anual).
    - Complejo respiratorio bovino (IBR, BVD, PI3, BRSV).
    - Leptospirosis.
    
    📚 Curiosidad:
    En sistemas de alta tecnología, una vaca Holstein puede llegar a producir hasta 12.000 litros por lactancia.
      `,
      expandido: false
    },    
    {
      titulo: 'Brahman',
      descripcion: 'Raza resistente al calor y enfermedades.',
      categoria: 'Razas',
      imagen: 'assets/fotos/Brahman.jpg',
      contenidoExtendido: `
        La Brahman es una raza cebuina originaria de la India, muy valorada por su resistencia al calor extremo, humedad y parásitos. 
        Esta adaptabilidad la ha convertido en una de las razas más utilizadas en cruzamientos en América Latina, especialmente en zonas tropicales.
    
        Su pelaje puede variar entre gris claro y rojo, tiene una joroba prominente sobre los hombros y orejas largas y colgantes. 
        Además, presenta una piel suelta que facilita la disipación del calor, y una gran tolerancia al estrés ambiental.
    
        📌 Recomendaciones:
        - Excelente opción para zonas de clima cálido y húmedo.
        - Ideal para cruzamiento con razas europeas para mejorar rusticidad.
        - Su carácter puede variar, por lo que se recomienda manejo paciente y constante.
    
        💉 Vacunación sugerida:
        - Fiebre aftosa.
        - Carbunco sintomático.
        - Rabia bovina (en regiones endémicas).
        - Hemoparásitos en zonas tropicales (consultar con el veterinario).
    
        📚 Curiosidad:
        La raza Brahman puede sobrevivir con forrajes de baja calidad y recorrer grandes distancias en búsqueda de agua y alimento, 
        características que le han permitido expandirse por todo el continente americano.
      `,
      expandido: false
    },
    {
      titulo: 'Normando',
      descripcion: 'Raza doble propósito: leche y carne.',
      categoria: 'Razas',
      imagen: 'assets/fotos/Normando.jpg',
      contenidoExtendido: `
        La Normando es una raza bovina originaria de Normandía, Francia, reconocida por su doble propósito: excelente producción de leche y carne de alta calidad. 
        Es muy apreciada en países como Colombia, especialmente en regiones montañosas y de clima templado, gracias a su gran capacidad de adaptación.
    
        Su pelaje característico es blanco con manchas marrón rojizo, y su contextura robusta le permite aprovechar eficientemente los forrajes de montaña. 
        Produce leche rica en grasa y proteína, ideal para la elaboración de quesos artesanales y productos lácteos gourmet.
    
        📌 Recomendaciones:
        - Ideal para sistemas mixtos (leche y carne) en zonas de ladera o con pastoreo extensivo.
        - Puede criarse en altitudes entre los 1.800 y 3.000 metros sobre el nivel del mar.
        - Se recomienda suplementación mineral, especialmente en épocas secas.
    
        💉 Vacunación sugerida:
        - Fiebre aftosa.
        - Brucelosis.
        - Mastitis (prevención y control).
        - Complejo respiratorio (en climas fríos y húmedos).
    
        📚 Curiosidad:
        En Francia, la leche Normanda es base para la producción de algunos de los quesos más finos del mundo como el Camembert y el Livarot. 
        En Colombia, muchas fincas usan la Normando para cruzamientos con razas como Brahman o Holstein, buscando rusticidad sin perder calidad láctea.
    
        🧀✨ ¿Sabías qué?
        Algunas queserías artesanales en los Andes colombianos ya etiquetan sus productos como “de leche normanda” para darle más valor gourmet.
      `,
      expandido: false
    },
    {
      titulo: 'Gyr',
      descripcion: 'Raza lechera tropical.',
      categoria: 'Razas',
      imagen: 'assets/fotos/Gyr.jpg',
      contenidoExtendido: `
        El Gyr es una raza bovina originaria de la India, reconocida por su destacada producción lechera en climas tropicales. 
        Pertenece al grupo de las razas cebuinas y es valorada por su rusticidad, longevidad y capacidad para producir leche incluso bajo condiciones de calor extremo y pastoreo extensivo.
    
        Esta raza se caracteriza por su frente prominente, orejas largas y colgantes, y un temperamento dócil. 
        La leche del Gyr tiene un contenido proteico y de grasa superior al promedio, lo que la hace ideal para derivados lácteos como yogures y quesos artesanales.
    
        📌 Recomendaciones:
        - Ideal para sistemas tropicales de mediana y baja tecnología.
        - Requiere sombra y disponibilidad constante de agua.
        - Excelente opción para cruzamiento con razas especializadas como la Holstein (dando origen al Girolando).
    
        💉 Vacunación sugerida:
        - Fiebre aftosa.
        - Brucelosis.
        - Tripanosomiasis (en regiones afectadas).
        - Clostridiosis y leptospirosis.
    
        📚 Curiosidad:
        En Brasil y Colombia, el Gyr es una de las razas preferidas para cruzamientos con razas europeas, 
        ya que transmite rusticidad sin perder la capacidad productiva. El cruce Gyr + Holstein (Girolando) es uno de los más utilizados en producción lechera tropical.
    
        🥛✨ ¿Sabías qué?
        Una vaca Gyr bien manejada puede producir entre 10 y 15 litros diarios en pastoreo, y hasta 25 litros en sistemas semiestabulados.
      `,
      expandido: false
    },
    {
      titulo: 'Angus',
      descripcion: 'Raza de carne muy reconocida.',
      categoria: 'Razas',
      imagen: 'assets/fotos/Angus.jpg',
      contenidoExtendido: `
        La Angus es una raza bovina originaria de Escocia, reconocida mundialmente por su excepcional calidad de carne. 
        Se caracteriza por su pelaje negro o rojo (Red Angus), su ausencia de cuernos (es mocha por naturaleza) y su temperamento dócil, lo que facilita su manejo.
    
        Su carne es famosa por el alto grado de marmoleo (grasa intramuscular), que le proporciona una textura suave, jugosa y con un sabor superior. 
        Esto la convierte en la preferida para cortes premium y exportación en mercados exigentes como Estados Unidos, Japón y Europa.
    
        📌 Recomendaciones:
        - Ideal para sistemas de producción de carne de alta calidad.
        - Excelente comportamiento en sistemas de engorde a pasto o confinamiento.
        - No es una raza lechera, por lo que no se recomienda para doble propósito.
    
        💉 Vacunación sugerida:
        - Fiebre aftosa.
        - Carbón sintomático.
        - Brucelosis.
        - Clostridiosis.
        - Encefalitis bovina (según zona).
    
        📚 Curiosidad:
        La carne Angus está tan bien posicionada a nivel global que muchas cadenas de restaurantes utilizan el sello "Certified Angus Beef" como garantía de calidad. 
        Algunos ejemplares llegan a tener precios muy altos en subastas ganaderas por su genética superior.
    
        🥩💰 ¿Sabías qué?
        En condiciones ideales, un novillo Angus puede alcanzar entre 500 y 600 kg en menos de 2 años, generando cortes de altísimo valor comercial.
      `,
      expandido: false
    },
    {
      titulo: 'Jersey',
      descripcion: 'Raza lechera de alta calidad.',
      categoria: 'Razas',
      imagen: 'assets/fotos/Jersey.jpg',
      contenidoExtendido: `
        La Jersey es una raza bovina originaria de la isla de Jersey, en el Canal de la Mancha. Es reconocida por su tamaño pequeño, su pelaje color café claro (a veces con tonos más oscuros), y su carácter muy dócil y manejable.
    
        A pesar de su tamaño, la vaca Jersey tiene un rendimiento lechero impresionante, especialmente en términos de calidad. 
        Su leche es una de las más ricas en grasa (alrededor del 5%) y proteínas (alrededor del 3.9%), lo que la hace ideal para la producción de mantequilla, quesos y otros productos lácteos gourmet.
    
        📌 Recomendaciones:
        - Excelente para sistemas de pastoreo rotacional y producción orgánica.
        - Requiere menos alimento por litro de leche producido comparado con otras razas.
        - Ideal para productores que buscan valor agregado en la calidad, no tanto en la cantidad.
    
        💉 Vacunación sugerida:
        - Brucelosis.
        - Fiebre aftosa.
        - Complejo mastitis (según zona y manejo).
        - Enfermedades del aparato reproductor.
    
        📚 Curiosidad:
        Aunque produce menos litros que una Holstein, el precio por litro de leche Jersey puede ser superior debido a su concentración de sólidos, lo que representa una gran ventaja en mercados especializados.
    
        🐄✨ Dato interesante:
        Las vacas Jersey alcanzan la madurez reproductiva rápidamente y tienen una alta tasa de fertilidad, lo que favorece la eficiencia reproductiva del hato.
      `,
      expandido: false
    },
    {
      titulo: 'Cebú',
      descripcion: 'Raza tropical de gran resistencia.',
      categoria: 'Razas',
      imagen: 'assets/fotos/Cebú.jpg',
      contenidoExtendido: `
        El Cebú es una raza bovina originaria del sur de Asia, particularmente de la India. Es una de las razas más utilizadas en regiones tropicales debido a su alta resistencia al calor, a enfermedades y a parásitos externos como las garrapatas.
    
        Es fácilmente reconocible por su gran joroba sobre los hombros, orejas largas y caídas, y piel suelta, características que ayudan a disipar el calor corporal. El Cebú es muy valorado tanto en sistemas de producción de carne como de leche, y es común su uso en cruzamientos con otras razas para mejorar la rusticidad del ganado.
    
        📌 Recomendaciones:
        - Ideal para sistemas de ganadería extensiva en regiones cálidas.
        - Requiere sombra natural y acceso constante a agua limpia.
        - Muy buena opción para cruzamientos con razas europeas.
    
        💉 Vacunación sugerida:
        - Fiebre aftosa.
        - Carbón sintomático.
        - Leptospirosis.
        - Tripanosomiasis (en zonas endémicas).
    
        📚 Curiosidad:
        En Colombia, muchas razas cebuinas como el Brahman, Gyr y Guzerá derivan de este tronco genético y son fundamentales en la ganadería nacional.
    
        🐂✨ Dato interesante:
        El Cebú tiene una longevidad productiva muy alta, lo que permite mantener animales en producción durante más años que otras razas más especializadas.
      `,
      expandido: false
    },
    {
      titulo: 'Brucelosis',
      descripcion: 'Enfermedad infecciosa que afecta a los animales y humanos.',
      categoria: 'Enfermedades',
      imagen: 'assets/fotos/Brucelosis.jpg',
      contenidoExtendido: `
        La brucelosis es una enfermedad zoonótica, es decir, puede ser transmitida de los animales al ser humano. Afecta principalmente a vacas, causando abortos, esterilidad y otros problemas reproductivos. Los animales infectados excretan la bacteria en su leche, saliva y orina, lo que la convierte en una enfermedad altamente contagiosa.
    
        📌 Recomendaciones:
        - Asegúrese de que todos los animales estén vacunados.
        - Realice pruebas periódicas para detectar animales infectados.
        - Aísle a los animales infectados inmediatamente para evitar brotes.
    
        💉 Vacunación sugerida:
        - Vacuna contra la brucelosis en ganado joven.
        - Cuarentena estricta en granjas donde se detecten animales infectados.
    
        📚 Curiosidad:
        La brucelosis no solo afecta a los bovinos, sino también a otros animales como cabras, ovejas y cerdos. En humanos, puede causar fiebre y dolor articular, y en casos graves puede afectar órganos internos.
    
        🐄✨ Dato interesante:
        La brucelosis ha sido erradicada en muchos países gracias a estrictos programas de vacunación y control sanitario.
      `,
      expandido: false
    },
    {
      titulo: 'Tuberculosis Bovina',
      descripcion: 'Enfermedad respiratoria que afecta principalmente los pulmones.',
      categoria: 'Enfermedades',
      imagen: 'assets/fotos/Tuberculosis.jpg',
      contenidoExtendido: `
        La tuberculosis bovina es una enfermedad crónica que afecta los pulmones de las vacas y otros animales. Se transmite principalmente a través del aire, por lo que la proximidad de los animales infectados en espacios cerrados aumenta el riesgo de contagio.
    
        📌 Recomendaciones:
        - Realice pruebas de tuberculosis regularmente en su ganado.
        - Aísle a los animales infectados para evitar la propagación.
        - Mantenga una buena ventilación en los establos para reducir la transmisión aérea.
    
        💉 Vacunación sugerida:
        - Aunque no existe una vacuna eficaz para la tuberculosis, es esencial mantener un programa de pruebas y aislamiento de animales infectados.
    
        📚 Curiosidad:
        La tuberculosis bovina también puede afectar a otros animales y al ser humano, especialmente en áreas donde el contacto con animales infectados es común. La transmisión a humanos es más probable en la manipulación de productos animales contaminados.
    
        🐄✨ Dato interesante:
        Algunos países han logrado erradicar la tuberculosis bovina mediante programas de saneamiento y control sanitario.
      `,
      expandido: false
    },
    {
      titulo: 'Fiebre Aftosa',
      descripcion: 'Enfermedad viral altamente contagiosa que afecta a rumiantes.',
      categoria: 'Enfermedades',
      imagen: 'assets/fotos/Aftosa.jpg',
      contenidoExtendido: `
        La fiebre aftosa es una enfermedad viral que afecta a los bovinos y otros animales de pezuña hendida. Es altamente contagiosa y puede provocar fiebre alta, úlceras en la boca y las pezuñas, y dificultades para alimentarse.
    
        📌 Recomendaciones:
        - Vacune a su ganado según las recomendaciones locales.
        - Mantenga a los animales enfermos separados de los sanos.
        - Evite el contacto con animales no vacunados.
    
        💉 Vacunación sugerida:
        - Vacunas periódicas contra la fiebre aftosa, especialmente en áreas donde la enfermedad es endémica.
    
        📚 Curiosidad:
        La fiebre aftosa ha sido erradicada de muchos países desarrollados, pero sigue siendo un problema en algunas regiones del mundo. Los brotes pueden causar grandes pérdidas económicas debido a la imposibilidad de comercializar los productos animales.
    
        🐄✨ Dato interesante:
        En algunos casos, la fiebre aftosa puede ser controlada por medio de restricciones en el movimiento de animales y productos animales.
      `,
      expandido: false
    },
    {
      titulo: 'Parasitosis Interna',
      descripcion: 'Infestación de parásitos internos que afectan el sistema digestivo.',
      categoria: 'Enfermedades',
      imagen: 'assets/fotos/Parasitosis.jpg',
      contenidoExtendido: `
        Las parasitosis internas, como la tenia y los gusanos redondos, son comunes en los bovinos. Estos parásitos afectan el sistema digestivo, reduciendo la capacidad de absorción de nutrientes, lo que puede afectar el crecimiento y la productividad del ganado.
    
        📌 Recomendaciones:
        - Realice desparacitación regular en su ganado.
        - Mantenga los corrales y áreas de pastoreo limpias y libres de parásitos.
        - Controle el acceso al agua de los animales para evitar la infestación por parásitos acuáticos.
    
        💉 Tratamientos sugeridos:
        - Desparacitación periódica con antiparasitarios eficaces.
        - Control de la higiene en los lugares de pastoreo y descanso de los animales.
    
        📚 Curiosidad:
        Los parásitos internos pueden causar anemia y otros problemas de salud en el ganado. En casos graves, pueden ser letales si no se controlan adecuadamente.
    
        🐄✨ Dato interesante:
        Las infestaciones por parásitos pueden afectar el rendimiento reproductivo de las vacas, por lo que es vital un control adecuado para mantener una producción óptima.
      `,
      expandido: false
    },
    {
      titulo: 'Leptospirosis',
      descripcion: 'Infección bacteriana transmitida por la orina de animales infectados.',
      categoria: 'Enfermedades',
      imagen: 'assets/fotos/Leptospirosis.jpg',
      contenidoExtendido: `
        La leptospirosis es una enfermedad bacteriana que puede afectar a las vacas y otros animales. Se transmite principalmente a través de la orina de animales infectados y puede causar fiebre, abortos, y daños en los órganos internos como los riñones y el hígado.
    
        📌 Recomendaciones:
        - Mantenga su ganado alejado de áreas contaminadas con orina de animales infectados.
        - Realice vacunas anuales para prevenir la leptospirosis.
        - Asegúrese de que los animales tengan acceso a agua limpia y no contaminada.
    
        💉 Vacunación sugerida:
        - Vacunas contra la leptospirosis, especialmente en zonas endémicas.
    
        📚 Curiosidad:
        La leptospirosis no solo afecta al ganado, también puede transmitirse a los seres humanos a través del contacto con agua o tierra contaminada. Es una de las enfermedades zoonóticas más comunes.
    
        🐄✨ Dato interesante:
        La leptospirosis es común en áreas donde el ganado vive en condiciones de hacinamiento o en contacto con aguas estancadas.
      `,
      expandido: false
    },
    {
      titulo: 'Mastitis',
      descripcion: 'Inflamación de la glándula mamaria, común en vacas lecheras.',
      categoria: 'Enfermedades',
      imagen: 'assets/fotos/Mastitis.jpg',
      contenidoExtendido: `
        La mastitis es una inflamación de la glándula mamaria, generalmente causada por infecciones bacterianas. Afecta la producción de leche de las vacas y puede provocar un descenso en la calidad de la misma, haciéndola inapropiada para el consumo.
    
        📌 Recomendaciones:
        - Mantenga un ambiente limpio en las instalaciones de ordeño.
        - Realice chequeos periódicos para detectar signos tempranos de mastitis.
        - Utilice productos de higiene adecuados para el ordeño, como desinfectantes para las ubres.
    
        💉 Tratamientos sugeridos:
        - Uso de antibióticos específicos según la bacteria que cause la mastitis.
        - Control de la alimentación para asegurar una adecuada nutrición.
    
        📚 Curiosidad:
        La mastitis es una de las principales causas de baja productividad en las granjas lecheras, y en algunos casos puede llevar al sacrificio de animales si no se trata adecuadamente.
    
        🐄✨ Dato interesante:
        En algunas regiones de Colombia, las granjas lecheras se enfrentan a pérdidas significativas por mastitis debido a la falta de medidas preventivas adecuadas en el manejo de las vacas lecheras.
      `,
      expandido: false
    },
    {
      titulo: 'Fascioliasis',
      descripcion: 'Enfermedad causada por parásitos hepáticos que afectan al hígado.',
      categoria: 'Enfermedades',
      imagen: 'assets/fotos/Fascioliasis.jpg',
      contenidoExtendido: `
        La fascioliasis es causada por un parásito llamado *Fasciola hepatica*, que afecta el hígado de los bovinos. Los animales infectados sufren daños en el hígado, lo que puede afectar su salud general y su capacidad para producir carne o leche.
    
        📌 Recomendaciones:
        - Controle el acceso de los animales a áreas con aguas estancadas, donde el parásito puede proliferar.
        - Realice tratamientos antiparasitarios periódicos, especialmente en zonas con alta incidencia de la enfermedad.
    
        💉 Tratamientos sugeridos:
        - Desparacitación con productos específicos para *Fasciola hepatica*.
        - Control de las fuentes de agua y el manejo adecuado del pastoreo para reducir el riesgo de infección.
    
        📚 Curiosidad:
        Esta enfermedad es más común en regiones de clima cálido y húmedo, como algunas áreas de Colombia. Es importante prestar atención al control de parásitos en estas zonas para prevenir la fascioliasis.
    
        🐄✨ Dato interesante:
        La fascioliasis es una de las principales causas de pérdida de peso en el ganado bovino en Colombia, afectando principalmente a los animales que pastan cerca de cuerpos de agua donde el parásito se encuentra en su fase larval.
      `,
      expandido: false
    },
    {
      titulo: 'Vibriosis',
      descripcion: 'Infección bacteriana que afecta el sistema reproductivo de las vacas.',
      categoria: 'Enfermedades',
      imagen: 'assets/fotos/Vibriosis.jpg',
      contenidoExtendido: `
        La vibriosis es una infección bacteriana que afecta el aparato reproductor de las vacas. Provoca infertilidad, abortos y problemas reproductivos. Esta enfermedad es común en muchas regiones tropicales, incluyendo Colombia, donde las condiciones favorecen su transmisión.
    
        📌 Recomendaciones:
        - Mantenga buenas prácticas de higiene y bioseguridad en las instalaciones de crianza.
        - Evite el contacto de animales infectados con animales sanos, especialmente en épocas de reproducción.
    
        💉 Vacunación sugerida:
        - Vacunas contra la vibriosis para reducir la incidencia de la enfermedad en las vacas reproductoras.
    
        📚 Curiosidad:
        La vibriosis es más común en regiones cálidas y húmedas. En Colombia, las zonas ganaderas tropicales son particularmente susceptibles a esta infección.
    
        🐄✨ Dato interesante:
        La vibriosis puede ser transmitida por los toros infectados durante la monta, lo que hace que el control de esta enfermedad sea un desafío en ganaderías de reproducción natural.
      `,
      expandido: false
    },        
    {
      titulo: 'Forraje de Pasto',
      descripcion: 'El pasto es una fuente de alimentación básica para el ganado.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Forraje.jpg',
      contenidoExtendido: `
        El pasto es uno de los alimentos más comunes para el ganado. Es rico en fibra y ayuda a la digestión. El pasto debe ser de buena calidad, libre de pesticidas y debe proporcionarse en grandes cantidades para mantener el ganado saludable. El pastoreo rotacional es una técnica eficaz.
    
        📌 **Beneficios**:
        - Rico en fibra, mejora la digestión.
        - Promueve una buena salud intestinal.
        - Fuente natural de nutrientes esenciales.
    
        🐄 **Recomendaciones**:
        - El pasto debe ser renovado constantemente para evitar que pierda su valor nutritivo.
        - Asegúrese de que el ganado no ingiera pasto con pesticidas.
    
        📚 **Dato interesante**:
        El pastoreo rotacional no solo mejora la calidad del pasto, sino que también permite una recuperación más rápida de los campos.
    
        💡 **Cuidado adicional**:
        Mantenga el pasto libre de maleza y asegúrese de que el ganado no ingiera pasto seco, ya que esto puede reducir su valor nutritivo.
      `,
      expandido: false
    },
    {
      titulo: 'Heno',
      descripcion: 'El heno es pasto seco y es esencial para la alimentación durante el invierno.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Heno.jpg',
      contenidoExtendido: `
        El heno es una fuente importante de fibra, especialmente durante los meses más fríos. Se obtiene cortando pastos y dejándolos secar al sol. Es una excelente alternativa cuando el pasto fresco no está disponible. Asegúrese de que el heno sea de buena calidad y no esté mohoso.
    
        📌 **Beneficios**:
        - Proporciona fibra adicional, favoreciendo la digestión.
        - Ideal para la alimentación en temporada baja (invierno).
        - Ayuda a mantener la salud del aparato digestivo del ganado.
    
        🐄 **Recomendaciones**:
        - Asegúrese de almacenar el heno en un lugar seco y fresco para evitar la formación de moho.
        - Use heno de buena calidad, evitando el heno que haya sido recogido demasiado tarde o que tenga un color muy oscuro.
    
        📚 **Dato interesante**:
        El heno de buena calidad, especialmente el de alfalfa, puede aumentar la producción de leche en vacas lecheras debido a su alto contenido proteico.
    
        💡 **Cuidado adicional**:
        Evite alimentar al ganado con heno que esté húmedo o mohoso, ya que puede causar problemas respiratorios y digestivos.
      `,
      expandido: false
    },
    {
      titulo: 'Suplementos Minerales',
      descripcion: 'Los suplementos minerales son necesarios para complementar la dieta.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Suplementos.jpg',
      contenidoExtendido: `
        Los suplementos minerales son esenciales para el ganado, especialmente en áreas donde los pastos no proporcionan todos los nutrientes necesarios. Estos suplementos ayudan a mejorar la salud general del ganado, la reproducción y la producción de leche. Los minerales más comunes incluyen calcio, fósforo y magnesio.
    
        📌 **Beneficios**:
        - Aseguran un desarrollo adecuado y un buen estado de salud.
        - Son fundamentales para el crecimiento de los terneros y la producción de leche.
        - Mejoran la salud ósea y la función muscular.
    
        🐄 **Recomendaciones**:
        - Administre los suplementos de acuerdo con las necesidades específicas del ganado (leche, carne, reproducción).
        - Es importante no sobrealimentar al ganado con minerales, ya que esto puede causar desequilibrios nutricionales.
    
        📚 **Dato interesante**:
        En algunas zonas, los suplementos minerales pueden incluir elementos como el selenio y el cobre, que son esenciales para prevenir deficiencias.
    
        💡 **Cuidado adicional**:
        Asegúrese de proporcionar agua fresca y limpia junto con los suplementos para facilitar su absorción y evitar problemas digestivos.
      `,
      expandido: false
    },
    {
      titulo: 'Concentrados',
      descripcion: 'Los concentrados son alimentos energéticos como los granos.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Concentrados.jpg',
      contenidoExtendido: `
        Los concentrados, como el maíz, la avena y la cebada, son ricos en energía. Se utilizan para complementar la dieta del ganado y mejorar la ganancia de peso y la producción de leche. Sin embargo, deben administrarse con moderación para evitar problemas digestivos.
    
        📌 **Beneficios**:
        - Ricos en energía, ideales para el engorde y la producción de leche.
        - Ayudan a aumentar el rendimiento productivo del ganado.
        - Son esenciales para animales en crecimiento o vacas lecheras.
    
        🐄 **Recomendaciones**:
        - Administre con moderación, ya que un exceso de concentrados puede causar trastornos digestivos.
        - Combine los concentrados con forrajes de buena calidad para equilibrar la dieta.
    
        📚 **Dato interesante**:
        El maíz es uno de los concentrados más utilizados en la ganadería, ya que es muy accesible y tiene un alto valor energético.
    
        💡 **Cuidado adicional**:
        Evite dar concentrados de baja calidad o contaminados, ya que esto puede causar problemas de salud como la acidosis ruminal.
      `,
      expandido: false
    },
    {
      titulo: 'Agua',
      descripcion: 'El agua es un recurso vital para la salud y el bienestar del ganado.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Agua.jpg',
      contenidoExtendido: `
        El agua es uno de los recursos más importantes para el ganado, ya que es esencial para mantener las funciones corporales. El agua es necesaria para la digestión, la circulación, la regulación de la temperatura y la producción de leche. Asegúrese de que el ganado siempre tenga acceso a agua limpia y fresca.
    
        📌 **Beneficios**:
        - Mantiene la hidratación y la temperatura corporal.
        - Es esencial para la digestión y la absorción de nutrientes.
        - Mejora la producción de leche en vacas lecheras.
    
        🐄 **Recomendaciones**:
        - Asegúrese de que el ganado tenga acceso continuo a agua limpia y fresca.
        - Cambie el agua regularmente para evitar que se contamine.
        - Durante los meses calurosos, asegúrese de que el ganado tenga suficientes fuentes de agua para evitar el estrés térmico.
    
        📚 **Dato interesante**:
        Un ganado bien hidratado puede consumir más alimentos y producir más leche, lo que contribuye a una mejor salud y mayor rendimiento productivo.
    
        💡 **Cuidado adicional**:
        Evite que el agua esté estancada o en fuentes sucias, ya que puede causar enfermedades en el ganado. Además, asegúrese de que las fuentes de agua estén en lugares accesibles para todos los animales.
      `,
      expandido: false
    },
    {
      titulo: 'Sorgo Forrajero',
      descripcion: 'El sorgo es una planta resistente y nutritiva para el ganado.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Sorgo.jpg',
      contenidoExtendido: `
        El sorgo forrajero es una excelente alternativa al pasto, especialmente en áreas donde el pasto es escaso o en períodos de sequía. Es resistente a las condiciones climáticas adversas y tiene un alto contenido de fibra, lo que favorece la digestión de los animales.
    
        📌 **Beneficios**:
        - Resistente a la sequía.
        - Alta producción de biomasa.
        - Bueno para animales en crecimiento o en fase de engorde.
    
        🐄 **Recomendaciones**:
        - Asegúrese de que el sorgo esté bien curado antes de ser consumido.
        - Rotación de pastoreo para evitar el sobrepastoreo.
    
        📚 **Dato interesante**:
        El sorgo forrajero también es utilizado en la elaboración de silo, lo que ayuda a mantener una fuente constante de alimentación durante los meses más fríos.
    
        💡 **Cuidado adicional**:
        Asegúrese de controlar la ingestión de *cianuro*, ya que ciertas variedades de sorgo pueden liberar esta sustancia tóxica en condiciones de estrés.
      `,
      expandido: false
    },
    {
      titulo: 'Silaje de Maíz',
      descripcion: 'Alimento fermentado que se obtiene del maíz picado.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Silaje.jpg',
      contenidoExtendido: `
        El silaje de maíz es un forraje fermentado que se obtiene al picar y almacenar el maíz en condiciones anaeróbicas (sin oxígeno). Este tipo de alimentación es especialmente útil durante los meses de invierno o cuando los pastos frescos no están disponibles.
    
        📌 **Beneficios**:
        - Aporta energía de fácil digestión.
        - Buena fuente de fibra y carbohidratos.
        - Mejora la producción de leche en vacas lecheras.
    
        🐄 **Recomendaciones**:
        - Asegúrese de que el silaje esté bien sellado para evitar la contaminación.
        - Monitoree la humedad del silo para prevenir la descomposición y el moho.
    
        📚 **Dato interesante**:
        El silaje de maíz también es un excelente conservante que se puede almacenar durante varios meses, asegurando alimento disponible durante todo el año.
    
        💡 **Cuidado adicional**:
        El silaje debe ser consumido poco después de su preparación para evitar que pierda su valor nutritivo. Además, su almacenamiento debe realizarse en condiciones controladas para evitar la formación de hongos.
      `,
      expandido: false
    },
    {
      titulo: 'Alfalfa',
      descripcion: 'Planta leguminosa rica en proteína, ideal para vacas lecheras.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Alfalfa.jpg',
      contenidoExtendido: `
        La alfalfa es una planta leguminosa que aporta una gran cantidad de proteínas y minerales. Es ideal para vacas lecheras y otros animales en crecimiento debido a su alto contenido de nutrientes esenciales.
    
        📌 **Beneficios**:
        - Alta en proteínas y minerales.
        - Favorece la producción de leche en vacas lecheras.
        - Buena para la digestión y el crecimiento de animales jóvenes.
    
        🐄 **Recomendaciones**:
        - Asegúrese de que la alfalfa no esté demasiado seca, ya que esto puede reducir su valor nutritivo.
        - Puede ser utilizada en combinación con otros forrajes para mejorar la dieta.
    
        📚 **Dato interesante**:
        En muchas regiones de Colombia, la alfalfa se cultiva como una fuente suplementaria de alimentación durante la temporada de lluvias, ya que se adapta bien a la mayoría de los suelos.
    
        💡 **Cuidado adicional**:
        Evite la sobrealimentación de alfalfa, ya que su alto contenido de proteína puede generar problemas digestivos si no se balancea adecuadamente con otros alimentos.
      `,
      expandido: false
    },
    {
      titulo: 'Melaza',
      descripcion: 'Subproducto del azúcar, utilizado como fuente de energía.',
      categoria: 'Alimentación',
      imagen: 'assets/fotos/Melaza.png',
      contenidoExtendido: `
        La melaza es un subproducto de la producción de azúcar que es utilizado como suplemento alimenticio en el ganado. Aporta una gran cantidad de energía rápida y puede mejorar la palatabilidad de la dieta.
    
        📌 **Beneficios**:
        - Fuente de energía rápida.
        - Mejora la digestión de otros alimentos.
        - Aumenta el apetito en animales con bajo consumo.
    
        🐄 **Recomendaciones**:
        - Utilícela en pequeñas cantidades, ya que su exceso puede causar problemas digestivos.
        - Es más efectiva cuando se mezcla con otros alimentos como el heno o los concentrados.
    
        📚 **Dato interesante**:
        En regiones de Colombia, la melaza es muy popular entre los ganaderos para complementar la dieta de los animales durante la temporada seca, cuando los pastos son escasos.
    
        💡 **Cuidado adicional**:
        Asegúrese de que la melaza se almacene en un lugar fresco y seco para evitar la fermentación, lo que podría afectar su calidad y valor nutritivo.
      `,
      expandido: false
    },                
    {
      titulo: 'Ciclo Reproductivo del Ganado',
      descripcion: 'Comprender el ciclo reproductivo es clave para mejorar la eficiencia de la cría.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Ciclo.jpg',
      contenidoExtendido: `
        El ciclo reproductivo del ganado bovino incluye etapas como el celo, la inseminación, la gestación y el parto. Identificar correctamente cada etapa permite optimizar los tiempos de reproducción y aumentar la tasa de concepción.
    
        📌 **Beneficios**:
        - Mejora la planificación de nacimientos.
        - Permite detectar problemas de fertilidad.
        - Aumenta la eficiencia reproductiva del hato.
    
        🐄 **Recomendaciones**:
        - Observar signos de celo para programar inseminaciones.
        - Mantener un registro detallado del historial reproductivo.
        - Aplicar protocolos de sincronización hormonal cuando sea necesario.
    
        📚 **Dato interesante**:
        El celo en vacas dura entre 12 y 18 horas. Detectarlo a tiempo es clave para una inseminación exitosa.
    
        💡 **Cuidado adicional**:
        La revisión periódica por parte de un veterinario reproductivo puede prevenir problemas como infecciones uterinas o infertilidad.
      `,
      expandido: false
    },
    {
      titulo: 'Inseminación Artificial',
      descripcion: 'Una técnica moderna que mejora la calidad genética del ganado.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Inseminación.jpg',
      contenidoExtendido: `
        La inseminación artificial (IA) consiste en depositar semen de un toro genéticamente seleccionado en el aparato reproductor de la vaca sin necesidad de monta natural. Es una técnica segura y efectiva que permite el mejoramiento genético.
    
        📌 **Beneficios**:
        - Aumenta la calidad genética del hato.
        - Reduce la transmisión de enfermedades venéreas.
        - Elimina la necesidad de mantener toros reproductores.
    
        🐄 **Recomendaciones**:
        - Capacitar al personal encargado de realizar la IA.
        - Utilizar pajillas de semen de toros certificados.
        - Aplicar protocolos hormonales si se requiere sincronización.
    
        📚 **Dato interesante**:
        Con IA se puede inseminar a más de 1,000 vacas con el semen de un solo toro de alta genética.
    
        💡 **Cuidado adicional**:
        Realiza controles de gestación entre los 30 y 45 días post-inseminación para verificar resultados.
      `,
      expandido: false
    },
    {
      titulo: 'Manejo de la Gestación',
      descripcion: 'Cuidados durante la gestación para asegurar una cría saludable.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Gestación.jpg',
      contenidoExtendido: `
        La gestación del ganado bovino dura aproximadamente 9 meses. Durante este periodo es fundamental cuidar la salud y nutrición de la vaca para asegurar un desarrollo fetal adecuado.
    
        📌 **Beneficios**:
        - Reduce riesgos de aborto o complicaciones al parto.
        - Mejora la salud de la cría al nacer.
        - Incrementa la producción futura de leche.
    
        🐄 **Recomendaciones**:
        - Proporcionar una dieta balanceada rica en minerales y vitaminas.
        - Realizar chequeos veterinarios periódicos.
        - Evitar el estrés físico y térmico.
    
        📚 **Dato interesante**:
        El 80% del desarrollo fetal ocurre en los últimos 3 meses de gestación.
    
        💡 **Cuidado adicional**:
        Asegura un espacio cómodo y limpio para la vaca gestante, sobre todo al acercarse el parto.
      `,
      expandido: false
    },
    {
      titulo: 'Parto y Cuidados Neonatales',
      descripcion: 'La atención al parto es esencial para la salud de la madre y de la cría.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Parto.jpg',
      contenidoExtendido: `
        El parto debe ser monitoreado para intervenir si hay complicaciones. Una vez nacido, el ternero debe recibir cuidados inmediatos como limpieza, corte del cordón umbilical y suministro de calostro.
    
        📌 **Beneficios**:
        - Aumenta la supervivencia de la cría.
        - Mejora la recuperación posparto de la madre.
        - Reduce el riesgo de infecciones neonatales.
    
        🐄 **Recomendaciones**:
        - Asistir el parto solo si hay complicaciones visibles.
        - Desinfectar adecuadamente el cordón umbilical.
        - Asegurar que el ternero consuma calostro en las primeras 6 horas.
    
        📚 **Dato interesante**:
        El calostro proporciona inmunidad pasiva y es esencial para proteger al ternero durante sus primeros días.
    
        💡 **Cuidado adicional**:
        Vigila la madre después del parto por signos de retención placentaria o infecciones uterinas.
      `,
      expandido: false
    },
    {
      titulo: 'Mejoramiento Genético',
      descripcion: 'Mejorar la genética del ganado mediante selección y cría.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Mejoramiento.png',
      contenidoExtendido: `
        El mejoramiento genético consiste en seleccionar animales con características superiores (producción, salud, conformación) para la reproducción, elevando así el nivel general del hato.
    
        📌 **Beneficios**:
        - Aumenta la rentabilidad del negocio ganadero.
        - Mejora la resistencia a enfermedades y el rendimiento.
        - Permite mantener estándares de calidad productiva.
    
        🐄 **Recomendaciones**:
        - Llevar registros detallados de producción y salud.
        - Utilizar tecnologías como IA y pruebas genéticas.
        - Seleccionar animales con buena conformación y temperamento.
    
        📚 **Dato interesante**:
        La genética influye hasta en un 50% en la producción lechera de una vaca.
    
        💡 **Cuidado adicional**:
        Evita la consanguinidad y planifica cruzamientos estratégicos para mantener diversidad genética.
      `,
      expandido: false
    },
    {
      titulo: 'Diagnóstico de Preñez',
      descripcion: 'Detectar a tiempo la preñez optimiza la planificación del hato.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Diagnóstico.png', // Puedes usar una imagen representativa
      contenidoExtendido: `
        El diagnóstico de preñez permite confirmar si una vaca está gestando y ayuda a monitorear la eficiencia reproductiva del rebaño. Puede realizarse mediante palpación rectal, ecografía o análisis de laboratorio.
    
        📌 **Beneficios**:
        - Permite tomar decisiones rápidas sobre vacas vacías.
        - Mejora la eficiencia reproductiva del hato.
        - Ahorra recursos al evitar alimentar vacas improductivas.
    
        🐄 **Recomendaciones**:
        - Realizar el diagnóstico entre los 30 y 45 días después de la inseminación.
        - Utilizar veterinarios capacitados o personal técnico.
        - Registrar resultados para mejorar la gestión del hato.
    
        📚 **Dato interesante**:
        La ecografía transrectal puede detectar la preñez con apenas 28 días desde la concepción.
    
        💡 **Cuidado adicional**:
        Realiza diagnósticos en lotes grandes para ahorrar tiempo y recursos.
      `,
      expandido: false
    },
    {
      titulo: 'Protocolo de Sincronización de Celo',
      descripcion: 'Facilita el manejo del hato y la planificación de inseminaciones.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Protocolo.jpg', // Imagen sugerida: vacas con collares marcadores o personal aplicando hormona
      contenidoExtendido: `
        La sincronización del celo consiste en administrar hormonas para controlar el ciclo reproductivo de las vacas y así programar de forma precisa el momento de la inseminación.
    
        📌 **Beneficios**:
        - Aumenta las tasas de concepción.
        - Reduce el tiempo entre partos.
        - Permite inseminar a varias vacas el mismo día.
    
        🐄 **Recomendaciones**:
        - Seguir el protocolo exacto recomendado por el veterinario.
        - Usar productos hormonales aprobados.
        - Vigilar el comportamiento post-aplicación para asegurar que todas respondieron.
    
        📚 **Dato interesante**:
        Existen protocolos como Ovsynch y Presynch que han demostrado altos índices de efectividad.
    
        💡 **Cuidado adicional**:
        Realiza los tratamientos en ambientes tranquilos para evitar que el estrés afecte la respuesta hormonal.
      `,
      expandido: false
    },
    {
      titulo: 'Cría y Destete',
      descripcion: 'Fase crucial para el desarrollo saludable del ternero.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Destete.jpg', // Imagen de un ternero mamando o junto a la madre
      contenidoExtendido: `
        La etapa de cría incluye desde el nacimiento hasta el destete del ternero. Durante este tiempo es fundamental asegurar una alimentación adecuada, control de enfermedades y un entorno libre de estrés.
    
        📌 **Beneficios**:
        - Mejora el crecimiento y desarrollo del ternero.
        - Reduce la mortalidad infantil en el ganado.
        - Aumenta el rendimiento futuro del animal.
    
        🐄 **Recomendaciones**:
        - Asegurar el consumo de calostro en las primeras horas de vida.
        - Aplicar vacunas y desparasitación en el tiempo correcto.
        - Realizar el destete de forma gradual y controlada.
    
        📚 **Dato interesante**:
        Un buen calostro contiene más de 50g/L de inmunoglobulinas, vitales para el sistema inmune del ternero.
    
        💡 **Cuidado adicional**:
        Usa sustitutos lácteos solo si la madre no puede amamantar, y asegúrate que sean de buena calidad.
      `,
      expandido: false
    },
    {
      titulo: 'Manejo de Toros Reproductores',
      descripcion: 'La salud y genética del toro afectan a todo el hato.',
      categoria: 'Reproducción',
      imagen: 'assets/fotos/Reproductores.jpg', // Imagen sugerida: toro de raza pura, en pasto o con sementales
      contenidoExtendido: `
        Los toros reproductores son responsables de gran parte de la genética del hato. Su manejo adecuado incluye evaluaciones sanitarias, físicas y de fertilidad.
    
        📌 **Beneficios**:
        - Mejora genética garantizada en las crías.
        - Reduce riesgos de enfermedades de transmisión sexual.
        - Aumenta la eficiencia de la monta natural.
    
        🐄 **Recomendaciones**:
        - Evaluar su capacidad reproductiva antes de cada temporada.
        - Proveer buena nutrición, ejercicio y control sanitario.
        - Evitar el sobreuso de un solo toro.
    
        📚 **Dato interesante**:
        Un toro en buenas condiciones puede cubrir entre 25 y 40 vacas por temporada.
    
        💡 **Cuidado adicional**:
        Separa los toros agresivos o con historial de enfermedades para evitar accidentes o contagios.
      `,
      expandido: false
    }              
  ];

  getCategoryClass(tarjeta: any): string {
    switch (tarjeta.categoria) {
      case 'Razas':
        return 'card-categoria-1';
      case 'Enfermedades':
        return 'card-categoria-2';
      case 'Alimentación':
        return 'card-categoria-3';
      case 'Reproducción':
        return 'card-categoria-4';
      default:
        return '';
    }
  }

  openModal(tarjeta: any) {
    this.selectedTarjeta = tarjeta;  // Asignamos la tarjeta seleccionada
    this.isModalOpen = true;  // Abrimos el modal
  }

  closeModal() {
    this.isModalOpen = false;  // Cerramos el modal
    this.selectedTarjeta = null;  // Limpiamos la tarjeta seleccionada
  }

  // Getter que filtra las tarjetas según la búsqueda y categoría seleccionada
  get tarjetasFiltradas() {
    return this.tarjetas.filter(t => {
      const coincideBusqueda = t.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                               t.descripcion.toLowerCase().includes(this.busqueda.toLowerCase());
      const coincideCategoria = this.categoriaSeleccionada === '' || t.categoria === this.categoriaSeleccionada;
      return coincideBusqueda && coincideCategoria;
    });
  }
}