import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MissionCategory } from './missions/entities/mission.entity';
import { DataSource } from 'typeorm';
import { Mission } from './missions/entities/mission.entity';

async function seedMissions() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const missionRepo = dataSource.getRepository(Mission);

    const missions = [
        // fitness
        { title: '¡Camina o corre 5 km!', description: 'Sal, respira y siente cómo tu cuerpo despierta.', category: MissionCategory.FITNESS, xpReward: 100, isPremium: false },
        { title: '¡Haz 50 flexiones repartidas como quieras!', description: 'Series de 10, 15… lo importante es llegar a 50.', category: MissionCategory.FITNESS, xpReward: 120, isPremium: false },
        { title: '¡Bebe 2 litros de agua durante todo el día!', description: 'Tu botella será tu mejor amiga hoy.', category: MissionCategory.FITNESS, xpReward: 40, isPremium: false },
        { title: '¡Duerme 8 horas completas esta noche!', description: 'Apaga pantallas y a recargar como se debe.', category: MissionCategory.FITNESS, xpReward: 110, isPremium: false },
        { title: '¡Dedica 20 minutos a estirarte a fondo!', description: 'YouTube o tu rutina favorita. ¡Tu cuerpo te lo agradecerá!', category: MissionCategory.FITNESS, xpReward: 80, isPremium: false },

        { title: '¡100 burpees en menos de 10 minutos!', description: 'Modo bestia activado. Solo para valientes.', category: MissionCategory.FITNESS, xpReward: 400, isPremium: false },
        { title: '¡Sube 50 pisos de escaleras sin parar!', description: 'Olvídate del ascensor hoy.', category: MissionCategory.FITNESS, xpReward: 350, isPremium: false },
        { title: '¡Salta la cuerda 1000 veces seguidas!', description: 'Si no tienes cuerda… imita el movimiento, ¡igual cuenta!', category: MissionCategory.FITNESS, xpReward: 380, isPremium: false },
        { title: '¡Plancha 5 minutos seguidos!', description: 'Quema, tiembla… y luego presume.', category: MissionCategory.FITNESS, xpReward: 450, isPremium: false },
        { title: '¡Termina el entrenamiento CrossFit!', description: '1 milla + 100 dominadas + 200 flexiones + 300 sentadillas + 1 milla. ¡Modo Leyenda!', category: MissionCategory.FITNESS, xpReward: 800, isPremium: false },

        // productivity
        { title: '¡Termina tu tarea más pesada hoy!', description: 'Esa que vienes evitando… hoy es el día.', category: MissionCategory.PRODUCTIVITY, xpReward: 180, isPremium: false },
        { title: '¡Completa tareas pendientes!', description: '25 min foco total + 5 min descanso. ¡A romper la procrastinación!', category: MissionCategory.PRODUCTIVITY, xpReward: 200, isPremium: false },
        { title: '¡Deja tu bandeja de entrada en cero!', description: 'Responde, archiva o borra. ¡Libertad mental garantizada!', category: MissionCategory.PRODUCTIVITY, xpReward: 150, isPremium: false },
        { title: '¡Lee 20 páginas de cualquier libro!', description: 'Sin distracciones. Solo tú y las palabras.', category: MissionCategory.PRODUCTIVITY, xpReward: 90, isPremium: false },
        { title: '¡Levántate a las 5:30 AM y sé leyenda!', description: 'El club de los madrugadores te espera.', category: MissionCategory.PRODUCTIVITY, xpReward: 300, isPremium: false },

        { title: '¡Escribe 2000 palabras hoy!', description: 'Blog, diario, novela… lo que sea, pero escribe.', category: MissionCategory.PRODUCTIVITY, xpReward: 350, isPremium: false },
        { title: '¡No toques el celular las primeras 2 horas del día!', description: 'Tu mente te lo agradecerá eternamente.', category: MissionCategory.PRODUCTIVITY, xpReward: 280, isPremium: false },
        { title: '¡Termina un curso entero de 2-3 horas hoy!', description: 'Sin pausas largas. Modo máquina.', category: MissionCategory.PRODUCTIVITY, xpReward: 400, isPremium: false },
        { title: '¡2 horas de trabajo sin ninguna distracción!', description: 'Celular en otro cuarto. Solo tú y tu obra maestra.', category: MissionCategory.PRODUCTIVITY, xpReward: 500, isPremium: false },

        // entertainment
        { title: '¡Ve una película clásica que nunca hayas visto!', description: 'Hoy toca cine de calidad.', category: MissionCategory.ENTERTAINMENT, xpReward: 100, isPremium: false },
        { title: '¡Lee un capítulo de libro solo por placer!', description: 'Sin culpa, sin prisa.', category: MissionCategory.ENTERTAINMENT, xpReward: 80, isPremium: false },
        { title: '¡Juega 30 minutos a lo que más te guste, sin culpa!', description: 'Hoy el gaming es autocuidado.', category: MissionCategory.ENTERTAINMENT, xpReward: 70, isPremium: false },
        { title: '¡Escucha un álbum completo de principio a fin!', description: 'Nada de playlists. Arte puro.', category: MissionCategory.ENTERTAINMENT, xpReward: 90, isPremium: false },
        { title: '¡Cocina una receta totalmente nueva!', description: 'Sorpréndete a ti mismo en la cocina.', category: MissionCategory.ENTERTAINMENT, xpReward: 120, isPremium: false },

        { title: '¡Maratón de miniserie: termina una temporada en 48h!', description: 'Pijama + palomitas = plan perfecto.', category: MissionCategory.ENTERTAINMENT, xpReward: 350, isPremium: false },
        { title: '¡Juega un videojuego en modo hardcore/ironman!', description: 'Sin morir ni una vez. ¿Aceptas el reto?', category: MissionCategory.ENTERTAINMENT, xpReward: 450, isPremium: false },
        { title: '¡Termina un videojuego al 100% en una semana!', description: 'Conoce el desenlace final de esa epica historia.', category: MissionCategory.ENTERTAINMENT, xpReward: 600, isPremium: false },
        { title: '¡Haz karaoke de 10 canciones seguidas!', description: 'Comparte o guarda para la posteridad jajaja.', category: MissionCategory.ENTERTAINMENT, xpReward: 380, isPremium: false },

        // maintenance
        { title: '¡Lava los platos justo después de comer!', description: 'No dejes que se acumulen.', category: MissionCategory.MAINTENANCE, xpReward: 50, isPremium: false },
        { title: '¡Haz tu cama apenas te levantes!', description: 'Primera victoria del día.', category: MissionCategory.MAINTENANCE, xpReward: 40, isPremium: false },
        { title: '¡Ordena tu escritorio o zona de trabajo!', description: '15 minutos y tu mente respira.', category: MissionCategory.MAINTENANCE, xpReward: 80, isPremium: false },
        { title: '¡Lava toda la ropa acumulada!', description: 'No dejes que la montaña crezca más.', category: MissionCategory.MAINTENANCE, xpReward: 100, isPremium: false },
        { title: '¡Tira o dona 10 cosas que no uses!', description: 'Menos cosas = más paz.', category: MissionCategory.MAINTENANCE, xpReward: 120, isPremium: false },

        { title: '¡Limpieza profunda del refrigerador!', description: 'Saca todo, limpia y reorganiza. Satisfacción nivel dios.', category: MissionCategory.MAINTENANCE, xpReward: 300, isPremium: false },
        { title: '¡Lava el carro o la bici a mano!', description: 'Con música y todo el flow.', category: MissionCategory.MAINTENANCE, xpReward: 280, isPremium: false },
        { title: '¡Cambia las sábanas y lávalas el mismo día!', description: 'Dormir en limpio es otro nivel.', category: MissionCategory.MAINTENANCE, xpReward: 250, isPremium: false },
        { title: '¡Orden digital: borra fotos inútiles del celular!', description: 'Libera espacio y mente.', category: MissionCategory.MAINTENANCE, xpReward: 320, isPremium: false },
    ];

    let created = 0;
    let skipped = 0;

   for (const m of missions) {
        const exists = await missionRepo.findOneBy({ title: m.title });
        if (!exists) {
            const newMission = missionRepo.create({
                ...m,
                isGlobal: true, // Las misiones del seed siempre son globales
            });
            
            await missionRepo.save(newMission);
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
