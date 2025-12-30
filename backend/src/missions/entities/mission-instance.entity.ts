import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Mission } from "./mission.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class MissionInstance {
    @PrimaryGeneratedColumn()
    id: number;

    // Relación con la plantilla original
    @ManyToOne(() => Mission, (mission) => mission.instances, { onDelete: 'CASCADE' })
    mission: Mission;

    @ManyToOne(() => User)
    user: User;

    // Fecha para la cual esta misión es válida (ej: 2025-12-26)
    @Column({ type: 'date' })
    scheduledDate: Date;

    @Column({ default: false })
    isCompleted: boolean;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}