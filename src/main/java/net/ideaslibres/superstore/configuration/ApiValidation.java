package net.ideaslibres.superstore.configuration;

import net.ideaslibres.superstore.controller.ItemsController;

import javax.validation.GroupSequence;
import javax.validation.groups.Default;

@GroupSequence({Default.class, ItemsController.class})
public interface ApiValidation {
}
