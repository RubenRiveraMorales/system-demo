import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MissionCategory, RecurrenceType } from './missions/entities/mission.entity';
import { DataSource } from 'typeorm';
import { Mission} from './missions/entities/mission.entity';

async function seedMissions() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const missionRepo = dataSource.getRepository(Mission);

    const missions = [
        // fitness
        { title: '¡Camina o corre 5 km!', description: 'Sal, respira y siente cómo tu cuerpo despierta.', category: MissionCategory.FITNESS, xpReward: 100 },
        { title: '¡Haz 50 flexiones repartidas como quieras!', description: 'Series de 10, 15… lo importante es llegar a 50.', category: MissionCategory.FITNESS, xpReward: 120 },
        { title: '¡Bebe 2 litros de agua durante todo el día!', description: 'Tu botella será tu mejor amiga hoy.', category: MissionCategory.FITNESS, xpReward: 40 },
        { title: '¡Duerme 8 horas completas esta noche!', description: 'Apaga pantallas y a recargar como se debe.', category: MissionCategory.FITNESS, xpReward: 110 },
        { title: '¡Dedica 20 minutos a estirarte a fondo!', description: 'YouTube o tu rutina favorita. ¡Tu cuerpo te lo agradecerá!', category: MissionCategory.FITNESS, xpReward: 80 },
        { title: '¡100 burpees en menos de 10 minutos!', description: 'Modo bestia activado. Solo para valientes.', category: MissionCategory.FITNESS, xpReward: 400 },
        { title: '¡Sube 50 pisos de escaleras sin parar!', description: 'Olvídate del ascensor hoy.', category: MissionCategory.FITNESS, xpReward: 350 },
        { title: '¡Salta la cuerda 1000 veces seguidas!', description: 'Si no tienes cuerda… imita el movimiento, ¡igual cuenta!', category: MissionCategory.FITNESS, xpReward: 380 },
        { title: '¡Plancha 5 minutos seguidos!', description: 'Quema, tiembla… y luego presume.', category: MissionCategory.FITNESS, xpReward: 450 },
        { title: '¡Termina el entrenamiento CrossFit!', description: '1 milla + 100 dominadas + 200 flexiones + 300 sentadillas + 1 milla. ¡Modo Leyenda!', category: MissionCategory.FITNESS, xpReward: 800 },

        // productivity
        { title: '¡Termina tu tarea más pesada hoy!', description: 'Esa que vienes evitando… hoy es el día.', category: MissionCategory.PRODUCTIVITY, xpReward: 180 },
        { title: '¡Completa tareas pendientes!', description: '25 min foco total + 5 min descanso. ¡A romper la procrastinación!', category: MissionCategory.PRODUCTIVITY, xpReward: 200 },
        { title: '¡Deja tu bandeja de entrada en cero!', description: 'Responde, archiva o borra. ¡Libertad mental garantizada!', category: MissionCategory.PRODUCTIVITY, xpReward: 150 },
        { title: '¡Lee 20 páginas de cualquier libro!', description: 'Sin distracciones. Solo tú y las palabras.', category: MissionCategory.PRODUCTIVITY, xpReward: 90 },
        { title: '¡Levántate a las 5:30 AM y sé leyenda!', description: 'El club de los madrugadores te espera.', category: MissionCategory.PRODUCTIVITY, xpReward: 300 },
        { title: '¡Escribe 2000 palabras hoy!', description: 'Blog, diario, novela… lo que sea, pero escribe.', category: MissionCategory.PRODUCTIVITY, xpReward: 350 },
        { title: '¡No toques el celular las primeras 2 horas del día!', description: 'Tu mente te lo agradecerá eternamente.', category: MissionCategory.PRODUCTIVITY, xpReward: 280 },
        { title: '¡Termina un curso entero de 2-3 horas hoy!', description: 'Sin pausas largas. Modo máquina.', category: MissionCategory.PRODUCTIVITY, xpReward: 400 },
        { title: '¡2 horas de trabajo sin ninguna distracción!', description: 'Celular en otro cuarto. Solo tú y tu obra maestra.', category: MissionCategory.PRODUCTIVITY, xpReward: 500 },

        // entertainment
        { title: '¡Ve una película clásica que nunca hayas visto!', description: 'Hoy toca cine de calidad.', category: MissionCategory.ENTERTAINMENT, xpReward: 100 },
        { title: '¡Lee un capítulo de libro solo por placer!', description: 'Sin culpa, sin prisa.', category: MissionCategory.ENTERTAINMENT, xpReward: 80 },
        { title: '¡Juega 30 minutos a lo que más te guste, sin culpa!', description: 'Hoy el gaming es autocuidado.', category: MissionCategory.ENTERTAINMENT, xpReward: 70 },
        { title: '¡Escucha un álbum completo de principio a fin!', description: 'Nada de playlists. Arte puro.', category: MissionCategory.ENTERTAINMENT, xpReward: 90 },
        { title: '¡Cocina una receta totalmente nueva!', description: 'Sorpréndete a ti mismo en la cocina.', category: MissionCategory.ENTERTAINMENT, xpReward: 120 },
        { title: '¡Maratón de miniserie: termina una temporada en 48h!', description: 'Pijama + palomitas = plan perfecto.', category: MissionCategory.ENTERTAINMENT, xpReward: 350 },
        { title: '¡Juega un videojuego en modo hardcore/ironman!', description: 'Sin morir ni una vez. ¿Aceptas el reto?', category: MissionCategory.ENTERTAINMENT, xpReward: 450 },
        { title: '¡Termina un videojuego al 100% en una semana!', description: 'Conoce el desenlace final de esa epica historia.', category: MissionCategory.ENTERTAINMENT, xpReward: 600 },
        { title: '¡Haz karaoke de 10 canciones seguidas!', description: 'Comparte o guarda para la posteridad jajaja.', category: MissionCategory.ENTERTAINMENT, xpReward: 380 },

        // maintenance
        { title: '¡Lava los platos justo después de comer!', description: 'No dejes que se acumulen.', category: MissionCategory.MAINTENANCE, xpReward: 50 },
        { title: '¡Haz tu cama apenas te levantes!', description: 'Primera victoria del día.', category: MissionCategory.MAINTENANCE, xpReward: 40 },
        { title: '¡Ordena tu escritorio o zona de trabajo!', description: '15 minutos y tu mente respira.', category: MissionCategory.MAINTENANCE, xpReward: 80 },
        { title: '¡Lava toda la ropa acumulada!', description: 'No dejes que la montaña crezca más.', category: MissionCategory.MAINTENANCE, xpReward: 100 },
        { title: '¡Tira o dona 10 cosas que no uses!', description: 'Menos cosas = más paz.', category: MissionCategory.MAINTENANCE, xpReward: 120 },
        { title: '¡Limpieza profunda del refrigerador!', description: 'Saca todo, limpia y reorganiza. Satisfacción nivel dios.', category: MissionCategory.MAINTENANCE, xpReward: 300 },
        { title: '¡Lava el carro o la bici a mano!', description: 'Con música y todo el flow.', category: MissionCategory.MAINTENANCE, xpReward: 280 },
        { title: '¡Cambia las sábanas y lávalas el mismo día!', description: 'Dormir en limpio es otro nivel.', category: MissionCategory.MAINTENANCE, xpReward: 250 },
        { title: '¡Orden digital: borra fotos inútiles del celular!', description: 'Libera espacio y mente.', category: MissionCategory.MAINTENANCE, xpReward: 320 },
    ];

    let created = 0;
    let skipped = 0;

    for (const m of missions) {
        const exists = await missionRepo.findOneBy({ title: m.title });
        if (!exists) {
            await missionRepo.insert({
                title: m.title,
                description: m.description,
                category: m.category,
                xpReward: m.xpReward,
                isPremium: false,
                isGlobal: true,
                recurrenceType: RecurrenceType.ONCE,
                startDate: new Date(),
                recurrenceDays: null,
                reminderTime: null,
                isActive: true,
            });
            console.log(`✅ ${m.title}`);
            created++;
        } else {
            skipped++;
        }
    }


    console.log(`${created} misiones creadas, ${skipped} ya existían`);
    await app.close();
}

seedMissions().catch(err => {
    console.error('Error en el seed:', err);
    process.exit(1);
});