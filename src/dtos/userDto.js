class UserDto {
  _id;

  name;

  email;

  constructor(model) {
    this._id = model._id;
    this.name = model.name;
    this.email = model.email;
  }
}

export default UserDto;
