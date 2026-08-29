// Añade una nueva dirección al usuario autenticado
const addAddress = async (req, res) => {
  try {
    const {street, city, postalCode, country, isDefault} = req.body;

    if (!street || !city || !postalCode) {
      return res.status(400).json({message: 'Calle, ciudad y código postal son obligatorios'});
    }

    if (isDefault) {
      req.user.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    req.user.addresses.push({street, city, postalCode, country, isDefault: !!isDefault});

    await req.user.save();

    return res
      .status(201)
      .json({message: 'Dirección añadida correctamente', addresses: req.user.addresses});
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: 'Error al añadir la dirección'});
  }
};

// Actualiza una dirección existente del usuario autenticado
const updateAddress = async (req, res) => {
  try {
    const {addressId} = req.params;
    const address = req.user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({message: 'Dirección no encontrada'});
    }

    const {street, city, postalCode, country, isDefault} = req.body;

    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;

    if (isDefault) {
      req.user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    await req.user.save();

    return res
      .status(200)
      .json({message: 'Dirección actualizada correctamente', addresses: req.user.addresses});
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({message: error.message});
    }
    return res.status(500).json({message: 'Error al actualizar la dirección'});
  }
};

// Elimina una dirección del usuario autenticado
const deleteAddress = async (req, res) => {
  try {
    const {addressId} = req.params;
    const address = req.user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({message: 'Dirección no encontrada'});
    }

    address.deleteOne();

    await req.user.save();

    return res
      .status(200)
      .json({message: 'Dirección eliminada correctamente', addresses: req.user.addresses});
  } catch {
    return res.status(500).json({message: 'Error al eliminar la dirección'});
  }
};

module.exports = {addAddress, updateAddress, deleteAddress};
