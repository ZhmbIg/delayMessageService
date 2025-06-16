import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  async createUser(@Body() dto: CreateUserDTO) {
    return await this.usersService.create(dto);
  }

  @Put(':id')
  async updateUser(@Param('id') id:string ,@Body() dto: UpdateUserDTO){
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Get()
  async getAllUsers(){
    return await this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string){
    return await this.usersService.findById(id);
  }
}
