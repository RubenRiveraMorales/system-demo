import { Controller, Get, Param, Patch, Delete, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createMissionDto: CreateMissionDto, @Request() req) {
    return this.missionsService.create(createMissionDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.missionsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissionDto: UpdateMissionDto) {
    return this.missionsService.update(+id, updateMissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionsService.remove(+id);
  }

 @UseGuards(AuthGuard('jwt'))
 @Post(':id/complete')
 complete(@Param('id') id: string, @Request() req){
    return this.missionsService.complete(+id, req.user.id)
 }

}
