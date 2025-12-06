import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Mission } from 'src/missions/entities/mission.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column ({ unique: true})
    email: string;

    @Column()
    password: string;

    @Column({ default: 1})
    level: number;

    @Column({ default: 0})
    currentXp: number;

    @Column({ default: false})
    isPremium: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Mission, (mission) => mission.user)
    missions: Mission[]
}