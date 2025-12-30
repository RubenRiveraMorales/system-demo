import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { MissionInstance } from "./mission-instance.entity";

export enum MissionCategory {
    FITNESS = 'fitness',
    PRODUCTIVITY = 'productivity',
    ENTERTAINMENT = 'entertainment',
    MAINTENANCE = 'maintenance',
    CUSTOM = 'custom',
}

export enum RecurrenceType {
    ONCE = 'once',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    CUSTOM = 'custom',

}

@Entity()
export class Mission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true})
    description: string;

    @Column('int')
    xpReward: number;

    @Column({
        type: 'enum',
        enum: RecurrenceType,
        default: RecurrenceType.ONCE
    })
    recurrenceType: RecurrenceType;

    @Column("int", {array: true, nullable: true})
    recurrenceDays: number[] | null;

    @Column({type: 'date', nullable: true})
    startDate: Date;

    @Column({type: 'date', nullable: true})
    endDate: Date;

    @Column({ type: 'varchar', length: 5, nullable: true })
    reminderTime: string | null;

    @Column({ default: false})
    isPremium: boolean;

    @Column({ default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: MissionCategory,
        default: MissionCategory.CUSTOM
    })
    category: MissionCategory;

    @Column({ default: false })
    isGlobal: boolean;

    @OneToMany(() => MissionInstance, (instance) => instance.mission)
    instances: MissionInstance[];

    @ManyToOne(() => User, (user) => user.missions, { nullable: true, eager: false })
    user: User;
}
