package net.ideaslibres.rhdstore.configuration;

import net.ideaslibres.rhdstore.controller.ItemsController;

import javax.validation.GroupSequence;
import javax.validation.groups.Default;

@GroupSequence({Default.class, ItemsController.class})
public interface ApiValidation {
}
